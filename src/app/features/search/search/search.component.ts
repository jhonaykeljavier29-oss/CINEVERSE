import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MapPipe } from '../../../shared/pipes/map.pipe';
import { JoinPipe } from '../../../shared/pipes/join.pipe';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { TmdbService } from '../../../core/services/tmdb.service';
import { FilmCardComponent } from '../../../shared/components/film-card/film-card.component';
import { SkeletonLoaderComponent } from '../../../shared/components/skeleton-loader/skeleton-loader.component';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, FilmCardComponent, SkeletonLoaderComponent, MapPipe, JoinPipe],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  searchQuery: string = '';
  searchResults: any[] = [];
  movies: any[] = [];
  people: any[] = [];
  tvShows: any[] = [];
  
  loading = false;
  searchPerformed = false;
  activeCategory: 'all' | 'movies' | 'people' | 'tv' = 'all';
  
  private searchSubject = new Subject<string>();

  constructor(private tmdbService: TmdbService) {
    this.searchSubject.pipe(
      debounceTime(500),
      distinctUntilChanged()
    ).subscribe(query => {
      if (query.trim()) {
        this.performSearch(query);
      } else {
        this.clearResults();
      }
    });
  }

  ngOnInit(): void {}

  onSearchInput(): void {
    this.searchSubject.next(this.searchQuery);
  }

  performSearch(query: string): void {
    this.loading = true;
    this.searchPerformed = true;
    
    this.tmdbService.searchMulti(query).subscribe({
      next: (data) => {
        this.searchResults = data.results;
        this.categorizeResults();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error searching:', error);
        this.loading = false;
      }
    });
  }

  categorizeResults(): void {
    this.movies = this.searchResults.filter(item => item.media_type === 'movie');
    this.people = this.searchResults.filter(item => item.media_type === 'person');
    this.tvShows = this.searchResults.filter(item => item.media_type === 'tv');
  }

  clearResults(): void {
    this.searchResults = [];
    this.movies = [];
    this.people = [];
    this.tvShows = [];
    this.searchPerformed = false;
  }

  setActiveCategory(category: 'all' | 'movies' | 'people' | 'tv'): void {
    this.activeCategory = category;
  }

  getDisplayedResults(): any[] {
    switch (this.activeCategory) {
      case 'movies':
        return this.movies;
      case 'people':
        return this.people;
      case 'tv':
        return this.tvShows;
      default:
        return this.searchResults;
    }
  }

  getProfileUrl(path: string | null): string {
    if (path) {
      return `${this.tmdbService.imageBaseUrl}w185${path}`;
    }
    return 'assets/images/no-profile.jpg';
  }

  getPosterUrl(path: string | null): string {
    if (path) {
      return `${this.tmdbService.imageBaseUrl}w200${path}`;
    }
    return 'assets/images/no-poster.jpg';
  }

  getYear(item: any): string {
    if (item.media_type === 'movie' && item.release_date) {
      return new Date(item.release_date).getFullYear().toString();
    }
    if (item.media_type === 'tv' && item.first_air_date) {
      return new Date(item.first_air_date).getFullYear().toString();
    }
    return '';
  }

  getItemTitle(item: any): string {
    if (item.media_type === 'movie') return item.title;
    if (item.media_type === 'tv') return item.name;
    return item.name || '';
  }

  getItemType(item: any): string {
    switch (item.media_type) {
      case 'movie': return 'Película';
      case 'tv': return 'Serie';
      case 'person': return 'Persona';
      default: return '';
    }
  }

  getItemLink(item: any): string[] {
    switch (item.media_type) {
      case 'movie': return ['/pelicula', item.id];
      case 'tv': return ['/serie', item.id];
      case 'person': return ['/persona', item.id];
      default: return ['/'];
    }
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.clearResults();
  }
}