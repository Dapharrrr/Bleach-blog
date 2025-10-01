'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Article, ArticleResponse, Comment } from '../../../types/article';
import CommentsList from '../../../components/CommentsList';
import CommentForm from '../../../components/CommentForm';
import styles from './page.module.css';

export default function ArticleBySlugPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [article, setArticle] = useState<Article | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCommentsForArticle = async (articleId: number) => {
    try {
      const response = await fetch(`http://localhost:1337/api/comments?filters[article][id][$eq]=${articleId}&sort=createdAt:desc`);
      if (response.ok) {
        const commentsData = await response.json();
        setComments(commentsData.data || []);
      }
    } catch (error) {
      console.error('Error loading comments:', error);
    }
  };

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setIsLoading(true);
        // Récupérer l'article par slug avec toutes les relations
        const url = `http://localhost:1337/api/articles?filters[slug][$eq]=${slug}&populate=*`;
        
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error('Article non trouvé');
        }
        
        const data = await response.json();
        
        if (data.data.length === 0) {
          throw new Error('Article non trouvé');
        }
        
        const articleData = data.data[0];
        
        // Extraire les commentaires selon la structure Strapi
        let commentsData = [];
        if (articleData.comments?.data) {
          commentsData = articleData.comments.data;
        } else if (Array.isArray(articleData.comments)) {
          commentsData = articleData.comments;
        } else if (articleData.comments) {
          commentsData = [articleData.comments];
        }
        setArticle(articleData);
        setComments(commentsData);
        
        // Si pas de commentaires chargés, essayons de les charger séparément
        if (!articleData.comments?.data || articleData.comments.data.length === 0) {
          await fetchCommentsForArticle(articleData.id);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      } finally {
        setIsLoading(false);
      }
    };

    if (slug) {
      fetchArticle();
    }
  }, [slug]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getImageUrl = (image: any) => {
    if (!image) return '';
    return `http://localhost:1337${image.url}`;
  };

  const renderContent = (content: any[]) => {
    if (!content) return null;
    
    return content.map((block, index) => {
      if (block.type === 'paragraph') {
        return (
          <p key={index} className={styles.paragraph}>
            {block.children?.map((child: any, childIndex: number) => (
              <span key={childIndex}>{child.text}</span>
            ))}
          </p>
        );
      }
      if (block.type === 'heading') {
        const level = block.level || 2;
        if (level === 1) {
          return (
            <h1 key={index} className={styles.heading}>
              {block.children?.map((child: any, childIndex: number) => (
                <span key={childIndex}>{child.text}</span>
              ))}
            </h1>
          );
        } else if (level === 2) {
          return (
            <h2 key={index} className={styles.heading}>
              {block.children?.map((child: any, childIndex: number) => (
                <span key={childIndex}>{child.text}</span>
              ))}
            </h2>
          );
        } else if (level === 3) {
          return (
            <h3 key={index} className={styles.heading}>
              {block.children?.map((child: any, childIndex: number) => (
                <span key={childIndex}>{child.text}</span>
              ))}
            </h3>
          );
        }
      }
      return null;
    });
  };

  const handleCommentAdded = (newComment: Comment) => {
    setComments(prev => [...prev, newComment]);
  };

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Chargement...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <h2>Erreur</h2>
          <p>{error}</p>
          <Link href="/" className={styles.backLink}>
            ← Retour aux articles
          </Link>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <h2>Article non trouvé</h2>
          <Link href="/" className={styles.backLink}>
            ← Retour aux articles
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <article className={styles.article}>
        <header className={styles.header}>
          <Link href="/" className={styles.backLink}>
            ← Retour aux articles
          </Link>
          
          {article.coverImage && (
            <div className={styles.imageContainer}>
              <Image
                src={getImageUrl(article.coverImage)}
                alt={article.coverImage.alternativeText || article.title}
                fill
                className={styles.coverImage}
                priority
              />
            </div>
          )}
          
          <div className={styles.headerContent}>
            <h1 className={styles.title}>{article.title}</h1>
            
            <div className={styles.meta}>
              <span className={styles.author}>
                Par {article.author?.data?.username || article.authorName}
              </span>
              <span className={styles.date}>
                Publié le {formatDate(article.publishedAt)}
              </span>
            </div>
          </div>
        </header>

        <div className={styles.content}>
          {renderContent(article.content)}
        </div>
      </article>

      <section className={styles.commentsSection}>
        <h2 className={styles.commentsTitle}>
          Commentaires ({comments.length})
        </h2>
        
        <CommentForm 
          articleId={article.id.toString()} 
          onCommentAdded={handleCommentAdded}
        />
        
        <CommentsList comments={comments} />
      </section>
    </div>
  );
}