'use client';

import { useEffect, useState } from 'react';
import ArticlesGrid from '../components/ArticlesGrid';
import { Article, ArticlesResponse } from '../types/article';
import styles from "./page.module.css";

export default function Home() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('http://localhost:1337/api/articles?populate=*');
        
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des articles');
        }
        
        const data: ArticlesResponse = await response.json();
        setArticles(data.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticles();
  }, []);

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.header}>
          <h1 className={styles.title}>Bleach Blog</h1>
          <p className={styles.subtitle}>Découvrez nos derniers articles</p>
        </div>

        {error ? (
          <div className={styles.error}>
            <p>Erreur : {error}</p>
          </div>
        ) : (
          <ArticlesGrid articles={articles} isLoading={isLoading} />
        )}
      </main>
    </div>
  );
}
