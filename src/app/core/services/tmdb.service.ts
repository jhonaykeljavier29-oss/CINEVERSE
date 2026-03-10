import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TmdbService {
  private apiKey = environment.tmdbApiKey;
  private baseUrl = environment.tmdbBaseUrl;
  public imageBaseUrl = environment.tmdbImageBaseUrl;

  constructor(private http: HttpClient) {}

  private getParams(additionalParams?: any): HttpParams {
    let params = new HttpParams()
      .set('api_key', this.apiKey)
      .set('language', 'es-ES');
    
    if (additionalParams) {
      Object.keys(additionalParams).forEach(key => {
        params = params.set(key, additionalParams[key]);
      });
    }
    return params;
  }

  // Tendencias
  getTrending(mediaType: string = 'all', timeWindow: string = 'week'): Observable<any> {
    const url = `${this.baseUrl}/trending/${mediaType}/${timeWindow}`;
    return this.http.get(url, { params: this.getParams() });
  }

  // Películas populares
  getPopularMovies(page: number = 1): Observable<any> {
    const url = `${this.baseUrl}/movie/popular`;
    return this.http.get(url, { params: this.getParams({ page }) });
  }

  // Próximos estrenos
  getUpcomingMovies(page: number = 1): Observable<any> {
    const url = `${this.baseUrl}/movie/upcoming`;
    return this.http.get(url, { params: this.getParams({ page }) });
  }

  // Mejor valoradas
  getTopRatedMovies(page: number = 1): Observable<any> {
    const url = `${this.baseUrl}/movie/top_rated`;
    return this.http.get(url, { params: this.getParams({ page }) });
  }

  // Descubrimiento con filtros
  discoverMovies(filters: any): Observable<any> {
    const url = `${this.baseUrl}/discover/movie`;
    return this.http.get(url, { params: this.getParams(filters) });
  }

  // Búsqueda múltiple
  searchMulti(query: string, page: number = 1): Observable<any> {
    const url = `${this.baseUrl}/search/multi`;
    return this.http.get(url, { params: this.getParams({ query, page }) });
  }

  // Detalles de película
  getMovieDetails(movieId: number): Observable<any> {
    const url = `${this.baseUrl}/movie/${movieId}`;
    return this.http.get(url, { 
      params: this.getParams({ 
        append_to_response: 'videos,credits,similar,images' 
      }) 
    });
  }

  // Detalles de persona
  getPersonDetails(personId: number): Observable<any> {
    const url = `${this.baseUrl}/person/${personId}`;
    return this.http.get(url, { 
      params: this.getParams({ 
        append_to_response: 'movie_credits,images,external_ids' 
      }) 
    });
  }

  // Géneros de películas
  getMovieGenres(): Observable<any> {
    const url = `${this.baseUrl}/genre/movie/list`;
    return this.http.get(url, { params: this.getParams() });
  }

  // Películas por género
  getMoviesByGenre(genreId: number, page: number = 1): Observable<any> {
    const url = `${this.baseUrl}/discover/movie`;
    return this.http.get(url, { 
      params: this.getParams({ 
        with_genres: genreId,
        page: page,
        sort_by: 'popularity.desc'
      }) 
    });
  }
}