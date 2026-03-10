import { Routes } from '@angular/router';

export const routes: Routes = [
  { 
    path: '', 
    loadComponent: () => import('./features/home/home/home.component').then(m => m.HomeComponent)
  },
  { 
    path: 'pelicula/:id', 
    loadComponent: () => import('./features/film-detail/film-detail/film-detail.component').then(m => m.FilmDetailComponent)
  },
  { 
    path: 'descubrir', 
    loadComponent: () => import('./features/discover/discover/discover.component').then(m => m.DiscoverComponent)
  },
  { 
    path: 'buscar', 
    loadComponent: () => import('./features/search/search/search.component').then(m => m.SearchComponent)
  },
  { 
    path: 'persona/:id', 
    loadComponent: () => import('./features/person-profile/person-profile/person-profile.component').then(m => m.PersonProfileComponent)
  },
  { 
    path: 'mis-listas', 
    loadComponent: () => import('./features/my-lists/my-lists/my-lists.component').then(m => m.MyListsComponent)
  },
  { 
    path: 'login', 
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },
  { 
    path: '**', 
    redirectTo: '' 
  }
];