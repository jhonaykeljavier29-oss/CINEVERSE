import { Component, OnInit, HostListener } from '@angular/core';  // ← Añadir HostListener aquí
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TmdbService } from '../../../core/services/tmdb.service';
import { FilmCardComponent } from '../../../shared/components/film-card/film-card.component';
import { SkeletonLoaderComponent } from '../../../shared/components/skeleton-loader/skeleton-loader.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, ],
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

  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    const x = (event.clientX / window.innerWidth) * 100;
    const y = (event.clientY / window.innerHeight) * 100;
    document.documentElement.style.setProperty('--mouse-x', `${x}%`);
    document.documentElement.style.setProperty('--mouse-y', `${y}%`);
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