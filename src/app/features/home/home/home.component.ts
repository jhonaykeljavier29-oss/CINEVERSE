import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TmdbService } from '../../core/services/tmdb.service';
import { FilmCardComponent } from '../../shared/components/film-card/film-card.component';
import { SkeletonLoaderComponent } from '../../shared/components/skeleton-loader/skeleton-loader.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, FilmCardComponent, SkeletonLoaderComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  upcomingMovies: any[] = [];
  trendingMovies: any[] = [];
  topRatedMovies: any[] = [];
  hiddenGems: any[] = [];

  loading = {
    upcoming: true,
    trending: true,
    topRated: true,
    hiddenGems: true
  };

  constructor(private tmdbService: TmdbService) {}

  ngOnInit(): void {
    this.loadUpcomingMovies();
    this.loadTrendingMovies();
    this.loadTopRatedMovies();
    this.loadHiddenGems();
  }

  loadUpcomingMovies(): void {
    this.tmdbService.getUpcomingMovies().subscribe({
      next: (data) => {
        this.upcomingMovies = data.results.slice(0, 8);
        this.loading.upcoming = false;
      },
      error: (error) => {
        console.error('Error loading upcoming movies:', error);
        this.loading.upcoming = false;
      }
    });
  }

  loadTrendingMovies(): void {
    this.tmdbService.getTrending('movie', 'week').subscribe({
      next: (data) => {
        this.trendingMovies = data.results.slice(0, 8);
        this.loading.trending = false;
      },
      error: (error) => {
        console.error('Error loading trending movies:', error);
        this.loading.trending = false;
      }
    });
  }

  loadTopRatedMovies(): void {
    this.tmdbService.getTopRatedMovies().subscribe({
      next: (data) => {
        this.topRatedMovies = data.results.slice(0, 8);
        this.loading.topRated = false;
      },
      error: (error) => {
        console.error('Error loading top rated movies:', error);
        this.loading.topRated = false;
      }
    });
  }

  loadHiddenGems(): void {
    this.tmdbService.getTopRatedMovies().subscribe({
      next: (data) => {
        // Filtrar películas con baja popularidad (joyas ocultas)
        this.hiddenGems = data.results
          .filter((movie: any) => movie.popularity < 30)
          .slice(0, 8);
        this.loading.hiddenGems = false;
      },
      error: (error) => {
        console.error('Error loading hidden gems:', error);
        this.loading.hiddenGems = false;
      }
    });
  }
}