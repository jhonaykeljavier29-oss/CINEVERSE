import { Component, Input, ElementRef, HostListener } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TmdbService } from '../../../core/services/tmdb.service';

@Component({
  selector: 'app-film-card',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './film-card.component.html',
  styleUrls: ['./film-card.component.css']
})
export class FilmCardComponent {
  @Input() film: any;
  @Input() isHorizontal: boolean = false;
  
  tiltTransform: string = '';
  private cardElement: HTMLElement | null = null;

  constructor(public tmdbService: TmdbService) {}

  @HostListener('mouseenter', ['$event'])
  onMouseEnter(event: MouseEvent) {
    const target = event.target as HTMLElement | null;
    this.cardElement = target ? target.closest('.film-card') : null;
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (!this.cardElement) return;
    
    const rect = this.cardElement.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;
    
    this.tiltTransform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    this.tiltTransform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    this.cardElement = null;
  }

  getFilmYear(): string {
    if (!this.film) return '';
    const date = this.film.release_date || this.film.first_air_date;
    return date ? new Date(date).getFullYear().toString() : '';
  }

  getFilmTitle(): string {
    return this.film.title || this.film.name || 'Título no disponible';
  }

  getPosterUrl(): string {
    if (this.film.poster_path) {
      return `${this.tmdbService.imageBaseUrl}w500${this.film.poster_path}`;
    }
    return 'assets/images/no-poster.jpg';
  }
}