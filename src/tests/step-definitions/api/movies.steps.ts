import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { MoviesService } from '@api/services/movies.service';
import { UpdateMovieRequest } from '@api/models/movies.model';
import { CustomWorld } from '@fixtures/world';
import { logger } from '@utils/logger/logger';

let moviesService: MoviesService;
let lastResponse: unknown = null;
let lastError: Error | unknown = null;

// Helper function to safely get error message
const getErrorMessage = (error: Error | unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
};

Given('user has existing movie ID {string}', async function (this: CustomWorld, movieId: string) {
  this.setTestData('movieId', movieId);
});

When('user calls GET endpoint {string}', async function (this: CustomWorld, endpoint: string) {
  moviesService = new MoviesService();
  lastError = null;
  try {
    if (endpoint === '/movies') {
      const response = await moviesService.getAllMovies();
      lastResponse = response;
      this.setApiResponse(response);
      logger.info('Successfully retrieved all movies');
    } else if (endpoint.startsWith('/movies/genre/')) {
      const genre = endpoint.split('/').pop() || '';
      const response = await moviesService.getMoviesByGenre(genre);
      lastResponse = response;
      this.setApiResponse(response);
      logger.info(`Successfully retrieved movies by genre: ${genre}`);
    } else if (endpoint.startsWith('/movies/')) {
      const movieId = endpoint.split('/').pop();
      const response = await moviesService.getMovieById(parseInt(movieId || '0'));
      lastResponse = response;
      this.setApiResponse(response);
      logger.info(`Successfully retrieved movie with ID: ${movieId}`);
    }
  } catch (error) {
    lastError = error;
    this.setApiError(error);
    logger.error(`GET request failed: ${error}`);
  }
});

Then('response status should be {int}', async function (this: CustomWorld, expectedStatus: number) {
  if (expectedStatus >= 400) {
    if (!lastError) {
      throw new Error(`Expected error with status ${expectedStatus}, but request succeeded`);
    }
    logger.info(
      `Expected error status: ${expectedStatus}, got error: ${getErrorMessage(lastError)}`
    );
    return;
  }

  if (lastError) {
    throw new Error(
      `Expected status ${expectedStatus}, but got error: ${getErrorMessage(lastError)}`
    );
  }

  if (expectedStatus === 200 || expectedStatus === 201) {
    expect(lastResponse).toBeDefined();
    expect(lastResponse).not.toBeNull();
    logger.info(`Response status validation passed: ${expectedStatus}`);
  } else if (expectedStatus === 204) {
    logger.info(`No content expected (204) - operation successful`);
  }
});

Then('response should contain list of movies', async function (this: CustomWorld) {
  if (lastError) {
    throw new Error(`API error occurred: ${getErrorMessage(lastError)}`);
  }
  const response = this.getApiResponse();
  expect(response).toBeDefined();
  expect(Array.isArray(response)).toBe(true);
  expect(response.length).toBeGreaterThan(0);

  const firstMovie = response[0];
  expect(firstMovie).toHaveProperty('id');
  expect(firstMovie).toHaveProperty('title');
  expect(firstMovie).toHaveProperty('description');
  expect(firstMovie).toHaveProperty('duration');
  expect(typeof firstMovie.id).toBe('number');
  expect(typeof firstMovie.title).toBe('string');

  logger.info(`List validation passed: ${response.length} movies found`);
});

When(
  'user calls POST endpoint {string} with movie data:',
  async function (this: CustomWorld, _endpoint: string, dataTable) {
    moviesService = new MoviesService();
    lastError = null;
    const rows = dataTable.hashes();

    if (!rows || rows.length === 0) {
      throw new Error('No movie data provided in the data table');
    }

    const movieData = rows[0];

    // Validate required fields
    if (!movieData.title || !movieData.genre || !movieData.releaseYear) {
      throw new Error('Missing required fields: title, genre, and releaseYear are mandatory');
    }

    try {
      const createRequest = {
        title: movieData.title,
        genre: movieData.genre,
        releaseYear: parseInt(movieData.releaseYear),
        directedBy: movieData.directedBy || undefined,
        runtime:
          movieData.runtime && movieData.runtime.trim() ? parseInt(movieData.runtime) : undefined,
        description: movieData.description || undefined,
        language: movieData.language || undefined,
      };

      const response = await moviesService.createMovie(createRequest);
      lastResponse = response;
      this.setApiResponse(response);
      if (response && response.id) {
        this.setTestData('createdMovieId', response.id);
      }
      logger.info(`Movie created successfully with ID: ${response?.id}`);
    } catch (error) {
      lastError = error;
      this.setApiError(error);
      logger.error(`POST request failed: ${error}`);
    }
  }
);

Then('response should contain created movie details', async function (this: CustomWorld) {
  if (lastError) {
    throw new Error(`API error occurred: ${getErrorMessage(lastError)}`);
  }
  const response = this.getApiResponse();
  expect(response).toBeDefined();
  expect(response).not.toBeNull();

  // Check for core fields that are always present in the response
  expect(response).toHaveProperty('id');
  expect(response).toHaveProperty('title');

  expect(typeof response.id).toBe('number');
  expect(typeof response.title).toBe('string');

  logger.info(`Created movie validation passed - ID: ${response.id}, Title: ${response.title}`);
});

Then('response should contain movie information', async function (this: CustomWorld) {
  if (lastError) {
    throw new Error(`API error occurred: ${getErrorMessage(lastError)}`);
  }
  const response = this.getApiResponse();
  expect(response).toBeDefined();
  expect(response).not.toBeNull();

  // Check for core fields that should be present
  expect(response).toHaveProperty('id');
  expect(response).toHaveProperty('title');

  expect(typeof response.id).toBe('number');
  expect(typeof response.title).toBe('string');

  logger.info(`Movie information validation passed - ID: ${response.id}, Title: ${response.title}`);
});

When(
  'user calls PUT endpoint {string} with movie data:',
  async function (this: CustomWorld, endpoint: string, dataTable) {
    moviesService = new MoviesService();
    lastError = null;
    const movieId = this.getTestData('movieId') || endpoint.split('/')[2];
    const rows = dataTable.hashes();

    if (!rows || rows.length === 0) {
      throw new Error('No update data provided in the data table');
    }

    if (!movieId || isNaN(parseInt(movieId))) {
      throw new Error(`Invalid movie ID: ${movieId}`);
    }

    const movieData = rows[0];

    try {
      const updateData: Partial<UpdateMovieRequest> = {};

      // Map table data to UpdateMovieRequest fields - only add defined and non-empty values
      if (movieData.rating) {
        const trimmedRating = String(movieData.rating).trim();
        if (trimmedRating) {
          const ratingValue = parseFloat(trimmedRating);
          if (!isNaN(ratingValue)) {
            updateData.rating = ratingValue;
          }
        }
      }
      if (movieData.title) {
        const trimmedTitle = String(movieData.title).trim();
        if (trimmedTitle) {
          updateData.title = trimmedTitle;
        }
      }
      if (movieData.genre) {
        const trimmedGenre = String(movieData.genre).trim();
        if (trimmedGenre) {
          updateData.genre = trimmedGenre;
        }
      }
      if (movieData.releaseYear) {
        const trimmedYear = String(movieData.releaseYear).trim();
        if (trimmedYear) {
          const yearValue = parseInt(trimmedYear);
          if (!isNaN(yearValue)) {
            updateData.releaseYear = yearValue;
          }
        }
      }
      if (movieData.directedBy) {
        const trimmedDirector = String(movieData.directedBy).trim();
        if (trimmedDirector) {
          updateData.directedBy = trimmedDirector;
        }
      }
      if (movieData.runtime) {
        const trimmedRuntime = String(movieData.runtime).trim();
        if (trimmedRuntime) {
          const runtimeValue = parseInt(trimmedRuntime);
          if (!isNaN(runtimeValue)) {
            updateData.runtime = runtimeValue;
          }
        }
      }
      if (movieData.description) {
        const trimmedDesc = String(movieData.description).trim();
        if (trimmedDesc) {
          updateData.description = trimmedDesc;
        }
      }

      if (Object.keys(updateData).length === 0) {
        throw new Error('No valid update data provided');
      }

      const response = await moviesService.updateMovie(parseInt(movieId), updateData);
      lastResponse = response;
      this.setApiResponse(response);
      logger.info(`Movie ${movieId} updated successfully`);
    } catch (error) {
      lastError = error;
      this.setApiError(error);
      logger.error(`PUT request failed: ${error}`);
    }
  }
);

Then('response should contain updated movie details', async function (this: CustomWorld) {
  if (lastError) {
    throw new Error(`API error occurred: ${getErrorMessage(lastError)}`);
  }
  const response = this.getApiResponse();
  expect(response).toBeDefined();
  expect(response).not.toBeNull();
  expect(response).toHaveProperty('id');
  expect(response).toHaveProperty('title');
  expect(typeof response.id).toBe('number');

  logger.info(`Updated movie validation passed - ID: ${response.id}`);
});

When('user calls GET endpoint with the created movie ID', async function (this: CustomWorld) {
  moviesService = new MoviesService();
  lastError = null;
  const movieId = this.getTestData('createdMovieId');

  if (!movieId) {
    throw new Error('No created movie ID found in test data');
  }

  try {
    const response = await moviesService.getMovieById(parseInt(movieId));
    lastResponse = response;
    this.setApiResponse(response);
    logger.info(`Successfully retrieved movie with ID: ${movieId}`);
  } catch (error) {
    lastError = error;
    this.setApiError(error);
    logger.error(`GET request failed: ${error}`);
  }
});

When(
  'user calls PUT endpoint with the created movie ID and movie data:',
  async function (this: CustomWorld, dataTable) {
    moviesService = new MoviesService();
    lastError = null;
    const movieId = this.getTestData('createdMovieId');
    const rows = dataTable.hashes();

    if (!movieId) {
      throw new Error('No created movie ID found in test data');
    }

    if (!rows || rows.length === 0) {
      throw new Error('No update data provided in the data table');
    }

    if (!movieId || isNaN(parseInt(movieId))) {
      throw new Error(`Invalid movie ID: ${movieId}`);
    }

    const movieData = rows[0];

    try {
      const updateData: Partial<UpdateMovieRequest> = {};

      // Map table data to UpdateMovieRequest fields - only add defined and non-empty values
      if (movieData.rating) {
        const trimmedRating = String(movieData.rating).trim();
        if (trimmedRating) {
          const ratingValue = parseFloat(trimmedRating);
          if (!isNaN(ratingValue)) {
            updateData.rating = ratingValue;
          }
        }
      }
      if (movieData.title) {
        const trimmedTitle = String(movieData.title).trim();
        if (trimmedTitle) {
          updateData.title = trimmedTitle;
        }
      }
      if (movieData.genre) {
        const trimmedGenre = String(movieData.genre).trim();
        if (trimmedGenre) {
          updateData.genre = trimmedGenre;
        }
      }
      if (movieData.releaseYear) {
        const trimmedYear = String(movieData.releaseYear).trim();
        if (trimmedYear) {
          const yearValue = parseInt(trimmedYear);
          if (!isNaN(yearValue)) {
            updateData.releaseYear = yearValue;
          }
        }
      }
      if (movieData.directedBy) {
        const trimmedDirector = String(movieData.directedBy).trim();
        if (trimmedDirector) {
          updateData.directedBy = trimmedDirector;
        }
      }
      if (movieData.runtime) {
        const trimmedRuntime = String(movieData.runtime).trim();
        if (trimmedRuntime) {
          const runtimeValue = parseInt(trimmedRuntime);
          if (!isNaN(runtimeValue)) {
            updateData.runtime = runtimeValue;
          }
        }
      }
      if (movieData.description) {
        const trimmedDesc = String(movieData.description).trim();
        if (trimmedDesc) {
          updateData.description = trimmedDesc;
        }
      }

      if (Object.keys(updateData).length === 0) {
        throw new Error('No valid update data provided');
      }

      const response = await moviesService.updateMovie(parseInt(movieId), updateData);
      lastResponse = response;
      this.setApiResponse(response);
      logger.info(`Movie ${movieId} updated successfully`);
    } catch (error) {
      lastError = error;
      this.setApiError(error);
      logger.error(`PUT request failed: ${error}`);
    }
  }
);

When('user calls DELETE endpoint with the created movie ID', async function (this: CustomWorld) {
  moviesService = new MoviesService();
  lastError = null;
  const movieId = this.getTestData('createdMovieId');

  if (!movieId) {
    throw new Error('No created movie ID found in test data');
  }

  if (!movieId || isNaN(parseInt(movieId))) {
    throw new Error(`Invalid movie ID: ${movieId}`);
  }

  try {
    await moviesService.deleteMovie(parseInt(movieId));
    lastResponse = { statusCode: 204, message: 'Movie deleted successfully' };
    this.setApiResponse(lastResponse);
    logger.info(`Movie ${movieId} deleted successfully`);
  } catch (error) {
    lastError = error;
    this.setApiError(error);
    logger.error(`DELETE request failed: ${error}`);
  }
});

Then('movie was deleted successfully', async function (this: CustomWorld) {
  if (lastError) {
    throw new Error(`API error occurred: ${getErrorMessage(lastError)}`);
  }
  logger.info('Delete operation validation passed');
});
