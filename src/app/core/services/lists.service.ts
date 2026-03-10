import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

export interface MovieList {
  id: string;
  name: string;
  description: string;
  movies: any[];
  createdAt: Date;
  isPublic: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ListsService {
  private watchlistKey = 'cineverse-watchlist';
  private favoritesKey = 'cineverse-favorites';
  private customListsKey = 'cineverse-custom-lists';

  constructor(private authService: AuthService) {
    console.log('✅ ListsService inicializado');
  }

  private getUserId(): string | null {
    const user = this.authService.getCurrentUser();
    console.log('Usuario actual:', user);
    return user?.id || null;
  }

  // ===== WATCHLIST =====
  getWatchlist(): any[] {
    const userId = this.getUserId();
    console.log('Obteniendo watchlist para userId:', userId);
    
    if (!userId) {
      console.log('No hay usuario logueado');
      return [];
    }
    
    const key = `${this.watchlistKey}-${userId}`;
    const data = localStorage.getItem(key);
    console.log('Datos de watchlist:', data);
    
    return data ? JSON.parse(data) : [];
  }

  addToWatchlist(movie: any): boolean {
    console.log('Intentando añadir a watchlist:', movie);
    const userId = this.getUserId();
    
    if (!userId) {
      console.log('❌ No hay usuario logueado');
      return false;
    }
    
    const watchlist = this.getWatchlist();
    console.log('Watchlist actual:', watchlist);
    
    // Verificar si ya existe
    if (watchlist.some(m => m.id === movie.id)) {
      console.log('❌ La película ya está en watchlist');
      return false;
    }
    
    // Añadir la película
    watchlist.push(movie);
    const key = `${this.watchlistKey}-${userId}`;
    localStorage.setItem(key, JSON.stringify(watchlist));
    
    console.log('✅ Película añadida a watchlist. Nueva lista:', watchlist);
    return true;
  }

  removeFromWatchlist(movieId: number): boolean {
    console.log('Intentando quitar de watchlist. MovieId:', movieId);
    const userId = this.getUserId();
    
    if (!userId) {
      console.log('❌ No hay usuario logueado');
      return false;
    }
    
    const watchlist = this.getWatchlist();
    const newWatchlist = watchlist.filter(m => m.id !== movieId);
    
    if (watchlist.length === newWatchlist.length) {
      console.log('❌ La película no estaba en watchlist');
      return false;
    }
    
    const key = `${this.watchlistKey}-${userId}`;
    localStorage.setItem(key, JSON.stringify(newWatchlist));
    
    console.log('✅ Película quitada de watchlist');
    return true;
  }

  isInWatchlist(movieId: number): boolean {
    const userId = this.getUserId();
    if (!userId) return false;
    
    const watchlist = this.getWatchlist();
    const exists = watchlist.some(m => m.id === movieId);
    console.log(`¿Película ${movieId} está en watchlist?`, exists);
    
    return exists;
  }

  // ===== FAVORITOS =====
  getFavorites(): any[] {
    const userId = this.getUserId();
    if (!userId) return [];
    
    const key = `${this.favoritesKey}-${userId}`;
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  }

  addToFavorites(movie: any): boolean {
    const userId = this.getUserId();
    if (!userId) return false;
    
    const favorites = this.getFavorites();
    
    if (favorites.some(m => m.id === movie.id)) {
      return false;
    }
    
    favorites.push(movie);
    const key = `${this.favoritesKey}-${userId}`;
    localStorage.setItem(key, JSON.stringify(favorites));
    
    console.log('✅ Película añadida a favoritos');
    return true;
  }

  removeFromFavorites(movieId: number): boolean {
    const userId = this.getUserId();
    if (!userId) return false;
    
    const favorites = this.getFavorites();
    const newFavorites = favorites.filter(m => m.id !== movieId);
    
    const key = `${this.favoritesKey}-${userId}`;
    localStorage.setItem(key, JSON.stringify(newFavorites));
    
    console.log('✅ Película quitada de favoritos');
    return true;
  }

  isInFavorites(movieId: number): boolean {
    const userId = this.getUserId();
    if (!userId) return false;
    
    return this.getFavorites().some(m => m.id === movieId);
  }
}