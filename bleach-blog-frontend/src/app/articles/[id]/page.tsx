'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Article } from '../../../types/article';
import styles from './page.module.css';

interface ArticleResponse {
  data: Article;
}

export default function ArticlePage() {
  const params = useParams();
  const id = params.id as string;
  const [article, setArticle] = useState<Article | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`http://localhost:1337/api/articles/${id}?populate=*`);
        
        if (!response.ok) {
          throw new Error('Article non trouvé');
        }
        
        const data: ArticleResponse = await response.json();
        setArticle(data.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchArticle();
    }
  }, [id]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getImageUrl = (coverImage: Article['coverImage']) => {
    if (coverImage.formats.large) {
      return `http://localhost:1337${coverImage.formats.large.url}`;
    } else if (coverImage.formats.medium) {
      return `http://localhost:1337${coverImage.formats.medium.url}`;
    }
    return `http://localhost:1337${coverImage.url}`;
  };

  const renderContent = (content: Article['content']) => {
    return content.map((block, index) => {
      if (block.type === 'paragraph') {
        return (
          <p key={index} className={styles.paragraph}>
            {block.children.map((child, childIndex) => (
              <span key={childIndex}>{child.text}</span>
            ))}
          </p>
        );
      }
      return null;
    });
  };

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <p>Chargement de l'article...</p>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <p>Erreur : {error || 'Article non trouvé'}</p>
          <Link href="/" className={styles.backLink}>
            ← Retour à l'accueil
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.article}>
        <Link href="/" className={styles.backLink}>
          ← Retour à l'accueil
        </Link>
        
        <header className={styles.header}>
          <h1 className={styles.title}>{article.title}</h1>
          <div className={styles.meta}>
            <p className={styles.author}>Par {article.authorName}</p>
            <p className={styles.date}>{formatDate(article.publishedAt)}</p>
          </div>
        </header>

        {article.coverImage && (
          <div className={styles.imageContainer}>
            <Image
              src={getImageUrl(article.coverImage)}
              alt={article.coverImage.alternativeText || article.title}
              width={800}
              height={500}
              className={styles.image}
              priority
            />
          </div>
        )}

        <div className={styles.content}>
          {renderContent(article.content)}
        </div>
      </div>
    </div>
  );
}
