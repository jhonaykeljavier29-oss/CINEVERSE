import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TmdbService } from '../../../core/services/tmdb.service';
import { RouterModule } from '@angular/router';  // ← IMPORTAR ESTO

@Component({
  selector: 'app-discover',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],  // ← AGREGAR RouterModule AQUÍ
  templateUrl: './discover.component.html',
  styleUrls: ['./discover.component.css']
})
export class DiscoverComponent implements OnInit {
  movies: any[] = [];
  genres: any[] = [];
  totalPages: number = 1;
  currentPage: number = 1;
  loading = true;
  showFilters = false;
  errorMessage: string = '';

  filters = {
    with_genres: '',
    sort_by: 'popularity.desc',
    'vote_average.gte': '',
    'vote_average.lte': '',
    'release_date.gte': '',
    'release_date.lte': '',
    with_original_language: ''
  };

  sortOptions = [
    { value: 'popularity.desc', label: 'Popularidad (mayor a menor)' },
    { value: 'popularity.asc', label: 'Popularidad (menor a mayor)' },
    { value: 'vote_average.desc', label: 'Puntuación (mayor a menor)' },
    { value: 'vote_average.asc', label: 'Puntuación (menor a mayor)' },
    { value: 'release_date.desc', label: 'Fecha de estreno (reciente)' },
    { value: 'release_date.asc', label: 'Fecha de estreno (antiguo)' }
  ];

  languages = [
    { code: '', name: 'Todos los idiomas' },
    { code: 'es', name: 'Español' },
    { code: 'en', name: 'Inglés' },
    { code: 'fr', name: 'Francés' },
    { code: 'de', name: 'Alemán' },
    { code: 'it', name: 'Italiano' },
    { code: 'ja', name: 'Japonés' },
    { code: 'ko', name: 'Coreano' }
  ];

  years: number[] = [];
  selectedYear: string = '';

  constructor(private tmdbService: TmdbService) {
    const currentYear = new Date().getFullYear();
    for (let year = currentYear; year >= 1900; year--) {
      this.years.push(year);
    }
  }

  ngOnInit(): void {
    this.loadGenres();
    this.discoverMovies();
  }

  loadGenres(): void {
    this.tmdbService.getMovieGenres().subscribe({
      next: (data: any) => {
        this.genres = data.genres || [];
      },
      error: (error: any) => {
        console.error('Error loading genres:', error);
      }
    });
  }

  discoverMovies(page: number = 1): void {
    this.loading = true;
    this.errorMessage = '';
    this.currentPage = page;

    const filters: any = {
      page: page,
      sort_by: this.filters.sort_by
    };

    if (this.filters.with_genres) {
      filters.with_genres = this.filters.with_genres;
    }

    if (this.filters['vote_average.gte']) {
      filters['vote_average.gte'] = this.filters['vote_average.gte'];
    }

    if (this.filters['vote_average.lte']) {
      filters['vote_average.lte'] = this.filters['vote_average.lte'];
    }

    if (this.selectedYear) {
      filters.primary_release_year = this.selectedYear;
    }

    if (this.filters.with_original_language) {
      filters.with_original_language = this.filters.with_original_language;
    }

    this.tmdbService.discoverMovies(filters).subscribe({
      next: (data: any) => {
        console.log('Movies loaded:', data);
        this.movies = data.results || [];
        this.totalPages = Math.min(data.total_pages || 1, 500);
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Error discovering movies:', error);
        this.errorMessage = 'Error al cargar películas. Verifica tu API key.';
        this.loading = false;
      }
    });
  }

  applyFilters(): void {
    this.discoverMovies(1);
    this.showFilters = false;
  }

  resetFilters(): void {
    this.filters = {
      with_genres: '',
      sort_by: 'popularity.desc',
      'vote_average.gte': '',
      'vote_average.lte': '',
      'release_date.gte': '',
      'release_date.lte': '',
      with_original_language: ''
    };
    this.selectedYear = '';
    this.discoverMovies(1);
  }

  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.discoverMovies(this.currentPage + 1);
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.discoverMovies(this.currentPage - 1);
    }
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.discoverMovies(page);
    }
  }

  getPagesArray(): number[] {
    const pages: number[] = [];
    const maxVisible = 5;
    let start = Math.max(1, this.currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(this.totalPages, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }

  trackByMovieId(index: number, movie: any): number {
    return movie.id;
  }
}