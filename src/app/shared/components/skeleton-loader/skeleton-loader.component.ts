import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-skeleton-loader',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './skeleton-loader.component.html',
  styleUrls: ['./skeleton-loader.component.css']
})
export class SkeletonLoaderComponent {
  @Input() type: 'card' | 'text' | 'circle' | 'rectangle' = 'card';
  @Input() count: number = 1;
  @Input() width: string = '100%';
  @Input() height: string = '100%';

  getArray(count: number): number[] {
    return Array(count).fill(0);
  }
}