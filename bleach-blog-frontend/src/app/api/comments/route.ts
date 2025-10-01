import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { authorName, content, articleId } = body;

    // Validation des données
    if (!authorName || !content || !articleId) {
      return NextResponse.json(
        { message: 'Tous les champs sont requis (authorName, content, articleId)' },
        { status: 400 }
      );
    }

    if (authorName.trim().length === 0 || content.trim().length === 0) {
      return NextResponse.json(
        { message: 'Le nom et le contenu ne peuvent pas être vides' },
        { status: 400 }
      );
    }

    if (authorName.length > 100) {
      return NextResponse.json(
        { message: 'Le nom ne peut pas dépasser 100 caractères' },
        { status: 400 }
      );
    }

    if (content.length > 1000) {
      return NextResponse.json(
        { message: 'Le commentaire ne peut pas dépasser 1000 caractères' },
        { status: 400 }
      );
    }

    // Créer le commentaire via l'API Strapi
    const strapiResponse = await fetch('http://localhost:1337/api/comments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: {
          authorName: authorName.trim(),
          content: content.trim(),
          article: articleId,
        },
      }),
    });

    if (!strapiResponse.ok) {
      const errorData = await strapiResponse.json();
      console.error('Erreur Strapi:', errorData);
      
      return NextResponse.json(
        { message: 'Erreur lors de la création du commentaire' },
        { status: 500 }
      );
    }

    const newComment = await strapiResponse.json();

    return NextResponse.json(newComment, { status: 201 });

  } catch (error) {
    console.error('Erreur lors de la création du commentaire:', error);
    return NextResponse.json(
      { message: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const articleId = searchParams.get('articleId');

    let url = 'http://localhost:1337/api/comments?populate=*&sort=createdAt:desc';
    
    if (articleId) {
      url += `&filters[article][documentId][$eq]=${articleId}`;
    }

    const response = await fetch(url);
    
    if (!response.ok) {
      return NextResponse.json(
        { message: 'Erreur lors de la récupération des commentaires' },
        { status: 500 }
      );
    }

    const comments = await response.json();
    return NextResponse.json(comments);

  } catch (error) {
    console.error('Erreur lors de la récupération des commentaires:', error);
    return NextResponse.json(
      { message: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}