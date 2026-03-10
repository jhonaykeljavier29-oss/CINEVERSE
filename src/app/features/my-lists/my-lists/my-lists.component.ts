import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { FilmCardComponent } from '../../../shared/components/film-card/film-card.component';

interface MovieList {
  id: string;
  name: string;
  description: string;
  movies: any[];
  createdAt: Date;
  isPublic: boolean;
}

@Component({
  selector: 'app-my-lists',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, FilmCardComponent],
  templateUrl: './my-lists.component.html',
  styleUrls: ['./my-lists.component.css']
})
export class MyListsComponent implements OnInit {
  lists: MovieList[] = [];
  selectedList: MovieList | null = null;
  
  showCreateModal = false;
  newList: Partial<MovieList> = {
    name: '',
    description: '',
    isPublic: false
  };

  // Para búsqueda y agregar películas
  searchQuery = '';
  searchResults: any[] = [];
  searching = false;
  showAddMovieModal = false;
  currentMovieToAdd: any = null;

  ngOnInit(): void {
    this.loadLists();
  }

  loadLists(): void {
    const savedLists = localStorage.getItem('cineverse-lists');
    if (savedLists) {
      this.lists = JSON.parse(savedLists);
      // Convertir strings de fecha a objetos Date
      this.lists.forEach(list => {
        list.createdAt = new Date(list.createdAt);
      });
    } else {
      // Crear lista de ejemplo
      this.lists = [
        {
          id: this.generateId(),
          name: 'Pendientes',
          description: 'Películas que quiero ver',
          movies: [],
          createdAt: new Date(),
          isPublic: false
        },
        {
          id: this.generateId(),
          name: 'Favoritas',
          description: 'Mis películas favoritas',
          movies: [],
          createdAt: new Date(),
          isPublic: true
        }
      ];
      this.saveLists();
    }
  }

  saveLists(): void {
    localStorage.setItem('cineverse-lists', JSON.stringify(this.lists));
  }

  generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  selectList(list: MovieList): void {
    this.selectedList = list;
  }

  createList(): void {
    if (!this.newList.name?.trim()) return;

    const list: MovieList = {
      id: this.generateId(),
      name: this.newList.name,
      description: this.newList.description || '',
      movies: [],
      createdAt: new Date(),
      isPublic: this.newList.isPublic || false
    };

    this.lists.push(list);
    this.saveLists();
    this.closeCreateModal();
    this.selectList(list);
  }

  deleteList(listId: string): void {
    if (confirm('¿Estás seguro de que quieres eliminar esta lista?')) {
      this.lists = this.lists.filter(l => l.id !== listId);
      if (this.selectedList?.id === listId) {
        this.selectedList = null;
      }
      this.saveLists();
    }
  }

  removeFromList(listId: string, movieId: number): void {
    const list = this.lists.find(l => l.id === listId);
    if (list) {
      list.movies = list.movies.filter(m => m.id !== movieId);
      this.saveLists();
    }
  }

  openAddMovieModal(): void {
    this.showAddMovieModal = true;
    this.searchQuery = '';
    this.searchResults = [];
  }

  closeAddMovieModal(): void {
    this.showAddMovieModal = false;
    this.searchQuery = '';
    this.searchResults = [];
  }

  searchMovies(): void {
    if (!this.searchQuery.trim() || !this.selectedList) return;

    this.searching = true;
    
    // Simular búsqueda (en producción usarías el servicio de TMDB)
    setTimeout(() => {
      // Aquí iría la llamada real a la API
      this.searching = false;
    }, 500);
  }

  addMovieToList(movie: any): void {
    if (!this.selectedList) return;

    // Verificar si ya existe
    const exists = this.selectedList.movies.some(m => m.id === movie.id);
    if (exists) {
      alert('Esta película ya está en la lista');
      return;
    }

    this.selectedList.movies.push(movie);
    this.saveLists();
    this.closeAddMovieModal();
  }

  closeCreateModal(): void {
    this.showCreateModal = false;
    this.newList = {
      name: '',
      description: '',
      isPublic: false
    };
  }

  getListCount(list: MovieList): number {
    return list.movies.length;
  }

  getRecentLists(): MovieList[] {
    return this.lists
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, 3);
  }
}