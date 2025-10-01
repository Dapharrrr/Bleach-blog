'use client';

import { useState } from 'react';
import { Comment } from '../types/article';
import styles from './CommentForm.module.css';

interface CommentFormProps {
  articleId: string;
  onCommentAdded: (comment: Comment) => void;
}

export default function CommentForm({ articleId, onCommentAdded }: CommentFormProps) {
  const [authorName, setAuthorName] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!authorName.trim() || !content.trim()) {
      setError('Veuillez remplir tous les champs');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          authorName: authorName.trim(),
          content: content.trim(),
          articleId: articleId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de l\'ajout du commentaire');
      }

      const newComment = await response.json();
      
      // Réinitialiser le formulaire
      setAuthorName('');
      setContent('');
      setSuccess(true);
      
      // Appeler le callback pour ajouter le commentaire à la liste
      onCommentAdded(newComment.data);
      
      // Cacher le message de succès après 3 secondes
      setTimeout(() => {
        setSuccess(false);
      }, 3000);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.commentForm}>
      <h3 className={styles.title}>Ajouter un commentaire</h3>
      
      {success && (
        <div className={styles.successMessage}>
          Commentaire ajouté avec succès !
        </div>
      )}
      
      {error && (
        <div className={styles.errorMessage}>
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="authorName" className={styles.label}>
            Votre nom *
          </label>
          <input
            type="text"
            id="authorName"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            className={styles.input}
            placeholder="Entrez votre nom"
            disabled={isSubmitting}
            maxLength={100}
          />
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="content" className={styles.label}>
            Commentaire *
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className={styles.textarea}
            placeholder="Écrivez votre commentaire..."
            disabled={isSubmitting}
            rows={4}
            maxLength={1000}
          />
          <div className={styles.charCount}>
            {content.length}/1000 caractères
          </div>
        </div>
        
        <button
          type="submit"
          disabled={isSubmitting || !authorName.trim() || !content.trim()}
          className={styles.submitButton}
        >
          {isSubmitting ? 'Publication...' : 'Publier le commentaire'}
        </button>
      </form>
    </div>
  );
}