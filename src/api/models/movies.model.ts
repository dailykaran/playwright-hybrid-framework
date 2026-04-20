export interface Movie {
  id: number;
  title: string;
  genre: string;
  releaseYear: number;
  description?: string;
  rating?: number;
  directedBy?: string;
  runtime?: number;
  language?: string;
}

export interface CreateMovieRequest {
  title: string;
  genre: string;
  releaseYear: number;
  description?: string;
  directedBy?: string;
  runtime?: number;
  language?: string;
}

export interface UpdateMovieRequest {
  title?: string;
  genre?: string;
  releaseYear?: number;
  description?: string;
  rating?: number;
  directedBy?: string;
  runtime?: number;
  language?: string;
}

export interface SearchMovieParams {
  genre?: string;
  releaseYear?: number;
  minRating?: number;
  title?: string;
}
