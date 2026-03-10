import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TmdbService } from '../../../core/services/tmdb.service';
import { FilmCardComponent } from '../../../shared/components/film-card/film-card.component';
import { SkeletonLoaderComponent } from '../../../shared/components/skeleton-loader/skeleton-loader.component';

@Component({
  selector: 'app-person-profile',
  standalone: true,
  imports: [CommonModule, RouterLink, FilmCardComponent ],
  templateUrl: './person-profile.component.html',
  styleUrls: ['./person-profile.component.css']
})
export class PersonProfileComponent implements OnInit {
  person: any = null;
  movieCredits: any = null;
  images: any[] = [];
  loading = true;
  activeTab: 'bio' | 'movies' | 'images' = 'bio';

  constructor(
    private route: ActivatedRoute,
    private tmdbService: TmdbService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: any) => {
      const id = params['id'];
      if (id) {
        this.loadPersonDetails(id);
      }
    });
  }

  loadPersonDetails(id: number): void {
    this.loading = true;
    this.tmdbService.getPersonDetails(id).subscribe({
      next: (data) => {
        this.person = data;
        this.movieCredits = data.movie_credits;
        this.images = data.images?.profiles || [];
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Error loading person details:', error);
        this.loading = false;
      }
    });
  }

  getProfileUrl(): string {
    if (this.person?.profile_path) {
      return `${this.tmdbService.imageBaseUrl}original${this.person.profile_path}`;
    }
    return 'assets/images/no-profile.jpg';
  }

  getThumbnailUrl(path: string): string {
    return `${this.tmdbService.imageBaseUrl}w185${path}`;
  }

  getAge(): number | null {
    if (!this.person?.birthday) return null;
    
    const birthDate = new Date(this.person.birthday);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    // Si falleció, calcular edad al morir
    if (this.person.deathday) {
      const deathDate = new Date(this.person.deathday);
      age = deathDate.getFullYear() - birthDate.getFullYear();
      const monthDiffDeath = deathDate.getMonth() - birthDate.getMonth();
      if (monthDiffDeath < 0 || (monthDiffDeath === 0 && deathDate.getDate() < birthDate.getDate())) {
        age--;
      }
    }
    
    return age;
  }

  getBirthInfo(): string {
    if (!this.person?.birthday) return 'Desconocido';
    
    let info = this.person.birthday;
    if (this.person.place_of_birth) {
      info += ` en ${this.person.place_of_birth}`;
    }
    
    return info;
  }

  getDeathInfo(): string | null {
    if (!this.person?.deathday) return null;
    
    let info = this.person.deathday;
    if (this.person.place_of_death) {
      info += ` en ${this.person.place_of_death}`;
    }
    
    return info;
  }

  getDepartmentCredits(): any[] {
    if (!this.movieCredits?.cast) return [];
    
    // Agrupar por departamento/década
    return this.movieCredits.cast
      .filter((movie: any) => movie.release_date)
      .sort((a: any, b: any) => {
        return new Date(b.release_date).getTime() - new Date(a.release_date).getTime();
      });
  }

  getKnownFor(): any[] {
    if (!this.movieCredits?.cast) return [];
    
    return this.movieCredits.cast
      .filter((movie: any) => movie.vote_count > 100)
      .sort((a: any, b: any) => b.vote_count - a.vote_count)
      .slice(0, 8);
  }

  setActiveTab(tab: 'bio' | 'movies' | 'images'): void {
    this.activeTab = tab;
  }

  getYear(date: string): string {
    return date ? new Date(date).getFullYear().toString() : '';
  }
}