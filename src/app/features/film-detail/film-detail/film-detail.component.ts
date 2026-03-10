import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { TmdbService } from '../../../core/services/tmdb.service';
import { AuthService } from '../../../core/services/auth.service';
import { ListsService } from '../../../core/services/lists.service';

@Component({
  selector: 'app-film-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './film-detail.component.html',
  styleUrls: ['./film-detail.component.css']
})
export class FilmDetailComponent implements OnInit {
  // Datos de la película
  movie: any = null;
  credits: any = null;
  videos: any[] = [];
  similarMovies: any[] = [];
  
  // Estados
  loading = true;
  activeTab: 'info' | 'cast' | 'videos' | 'similar' = 'info';
  
  // Tráiler
  selectedVideo: SafeResourceUrl | null = null;
  showTrailerModal = false;
  
  // Listas
  isInWatchlist = false;
  isInFavorites = false;
  listMessage = '';
  showMessage = false;

  constructor(
    private route: ActivatedRoute,
    private tmdbService: TmdbService,
    private sanitizer: DomSanitizer,
    @Inject(AuthService) private authService: AuthService,
    private listsService: ListsService
  ) {
    console.log('🎬 FilmDetailComponent inicializado');
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.loadMovieDetails(id);
      }
    });
  }

  // Cargar detalles de la película
  loadMovieDetails(id: number): void {
    this.loading = true;
    this.tmdbService.getMovieDetails(id).subscribe({
      next: (data) => {
        console.log('✅ Película cargada:', data.title);
        this.movie = data;
        this.credits = data.credits;
        this.videos = data.videos?.results || [];
        this.similarMovies = data.similar?.results?.slice(0, 8) || [];
        this.loading = false;
        this.checkListsStatus();
      },
      error: (error) => {
        console.error('❌ Error cargando película:', error);
        this.loading = false;
      }
    });
  }

  // Verificar si está en listas
  checkListsStatus(): void {
    if (this.authService.isLoggedIn() && this.movie) {
      this.isInWatchlist = this.listsService.isInWatchlist(this.movie.id);
      this.isInFavorites = this.listsService.isInFavorites(this.movie.id);
    }
  }

  // ===== FUNCIONES PARA TRÁILER =====
  openTrailer(video: any): void {
    if (video.site === 'YouTube') {
      const url = `https://www.youtube.com/embed/${video.key}?autoplay=1&rel=0`;
      this.selectedVideo = this.sanitizer.bypassSecurityTrustResourceUrl(url);
      this.showTrailerModal = true;
      document.body.style.overflow = 'hidden';
    }
  }

  closeTrailer(): void {
    this.showTrailerModal = false;
    this.selectedVideo = null;
    document.body.style.overflow = 'auto';
  }

  // ===== FUNCIONES PARA LISTAS =====
  toggleWatchlist(): void {
    if (!this.authService.isLoggedIn()) {
      alert('Debes iniciar sesión para guardar películas');
      return;
    }
    
    if (this.isInWatchlist) {
      const removed = this.listsService.removeFromWatchlist(this.movie.id);
      if (removed) {
        this.isInWatchlist = false;
        this.showMessage = true;
        this.listMessage = '❌ Eliminada de Mi Lista';
      }
    } else {
      const added = this.listsService.addToWatchlist(this.movie);
      if (added) {
        this.isInWatchlist = true;
        this.showMessage = true;
        this.listMessage = '✅ Añadida a Mi Lista';
      }
    }

    // Ocultar mensaje después de 2 segundos
    setTimeout(() => {
      this.showMessage = false;
      this.listMessage = '';
    }, 2000);
  }

  toggleFavorites(): void {
    if (!this.authService.isLoggedIn()) {
      alert('Debes iniciar sesión para guardar películas');
      return;
    }
    
    if (this.isInFavorites) {
      this.listsService.removeFromFavorites(this.movie.id);
      this.isInFavorites = false;
    } else {
      this.listsService.addToFavorites(this.movie);
      this.isInFavorites = true;
    }
  }

  // ===== FUNCIONES PARA REPARTO =====
  getCast(): any[] {
    return this.credits?.cast?.slice(0, 12) || [];
  }

  getDirector(): string {
    const director = this.credits?.crew?.find((c: any) => c.job === 'Director');
    return director?.name || 'Desconocido';
  }

  // ===== GETTERS PARA DATOS DE LA PELÍCULA =====
  getBackdropUrl(): string {
    return this.movie?.backdrop_path 
      ? `https://image.tmdb.org/t/p/original${this.movie.backdrop_path}`
      : '';
  }

  getPosterUrl(): string {
    return this.movie?.poster_path 
      ? `https://image.tmdb.org/t/p/w500${this.movie.poster_path}`
      : 'assets/images/no-poster.jpg';
  }

  getProfileUrl(path: string | null): string {
    return path 
      ? `https://image.tmdb.org/t/p/w185${path}`
      : 'assets/images/no-profile.jpg';
  }

  getYear(): string {
    return this.movie?.release_date 
      ? new Date(this.movie.release_date).getFullYear().toString() 
      : '';
  }

  getRuntime(): string {
    if (!this.movie?.runtime) return 'N/A';
    const hours = Math.floor(this.movie.runtime / 60);
    const minutes = this.movie.runtime % 60;
    return `${hours}h ${minutes}min`;
  }

  getGenres(): string {
    return this.movie?.genres?.map((g: any) => g.name).join(', ') || '';
  }

  getRating(): number {
    return this.movie?.vote_average 
      ? Math.round(this.movie.vote_average * 10) / 10 
      : 0;
  }

  getRatingPercentage(): number {
    return (this.getRating() / 10) * 100;
  }

  formatCurrency(amount: number): string {
    if (!amount) return 'N/A';
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  }
}