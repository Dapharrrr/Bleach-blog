'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArticlesResponse } from '../../types/article';
import ArticlesGrid from '../../components/ArticlesGrid';
import styles from './page.module.css';

export default function ArticlesPage() {
  const [articlesData, setArticlesData] = useState<ArticlesResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('http://localhost:1337/api/articles?populate=*&sort=publishedAt:desc');
        
        if (!response.ok) {
          throw new Error('Erreur lors du chargement des articles');
        }
        
        const data: ArticlesResponse = await response.json();
        setArticlesData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticles();
  }, []);

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Chargement des articles...</div>
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
            ← Retour à l'accueil
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Tous les articles</h1>
        <p className={styles.subtitle}>
          Découvrez tous nos articles ({articlesData?.data.length || 0} articles)
        </p>
      </header>

      {articlesData?.data && articlesData.data.length > 0 ? (
        <ArticlesGrid articles={articlesData.data} />
      ) : (
        <div className={styles.emptyState}>
          <h2>Aucun article disponible</h2>
          <p>Revenez plus tard pour découvrir nos nouveaux contenus !</p>
          <Link href="/" className={styles.backLink}>
            ← Retour à l'accueil
          </Link>
        </div>
      )}
    </div>
  );
}