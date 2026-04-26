import { ApiClient } from '../clients/api.client';
import {
  Movie,
  CreateMovieRequest,
  UpdateMovieRequest,
  SearchMovieParams,
} from '../models/movies.model';
import { logger } from '@utils/logger/logger';

export class MoviesService {
  private apiClient: ApiClient;

  constructor() {
    this.apiClient = new ApiClient();
  }

  /**
   * Get all movies
   */
  async getAllMovies(): Promise<Movie[]> {
    try {
      const response = await this.apiClient.get<Movie[]>('/movies');
      logger.info(`Retrieved ${response.data.length} movies`);
      return response.data;
    } catch (error) {
      logger.error(`Failed to get movies: ${error}`);
      throw error;
    }
  }

  /**
   * Get movie by ID
   */
  async getMovieById(id: number): Promise<Movie> {
    try {
      const response = await this.apiClient.get<Movie>(`/movies/${id}`);
      logger.info(`Retrieved movie with ID: ${id}`);
      return response.data;
    } catch (error) {
      logger.error(`Failed to get movie ${id}: ${error}`);
      throw error;
    }
  }

  /**
   * Create new movie
   */
  async createMovie(movieData: CreateMovieRequest): Promise<Movie> {
    try {
      const response = await this.apiClient.post<Movie>('/movies', movieData);
      logger.info(`Movie created with ID: ${response.data.id}`);
      return response.data;
    } catch (error) {
      logger.error(`Failed to create movie: ${error}`);
      throw error;
    }
  }

  /**
   * Update movie
   */
  async updateMovie(id: number, movieData: UpdateMovieRequest): Promise<Movie> {
    try {
      const response = await this.apiClient.put<Movie>(`/movies/${id}`, movieData);
      logger.info(`Movie ${id} updated successfully`);
      return response.data;
    } catch (error) {
      logger.error(`Failed to update movie ${id}: ${error}`);
      throw error;
    }
  }

  /**
   * Delete movie
   */
  async deleteMovie(id: number): Promise<void> {
    try {
      await this.apiClient.delete(`/movies/${id}`);
      logger.info(`Movie ${id} deleted successfully`);
    } catch (error) {
      logger.error(`Failed to delete movie ${id}: ${error}`);
      throw error;
    }
  }

  /**
   * Search movies by criteria
   */
  async searchMovies(params: SearchMovieParams): Promise<Movie[]> {
    try {
      const response = await this.apiClient.get<Movie[]>('/movies/search', {
        params,
      });
      logger.info(`Found ${response.data.length} movies matching criteria`);
      return response.data;
    } catch (error) {
      logger.error(`Failed to search movies: ${error}`);
      throw error;
    }
  }

  /**
   * Get movies by genre
   */
  async getMoviesByGenre(genre: string): Promise<Movie[]> {
    try {
      const response = await this.apiClient.get<Movie[]>(`/movies/genre/${genre}`);
      logger.info(`Retrieved ${response.data.length} movies for genre: ${genre}`);
      return response.data;
    } catch (error) {
      logger.error(`Failed to get movies by genre ${genre}: ${error}`);
      throw error;
    }
  }
}
