import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appHoverSound]',
  standalone: true
})
export class HoverSoundDirective {
  @Input() soundEnabled: boolean = true;
  @Input() soundSrc: string = '/assets/sounds/hover.mp3';
  
  private audio: HTMLAudioElement | null = null;

  constructor(private el: ElementRef) {
    if (this.soundEnabled) {
      this.audio = new Audio();
      this.audio.src = this.soundSrc;
      this.audio.volume = 0.3;
    }
  }

  @HostListener('mouseenter')
  onMouseEnter() {
    if (this.soundEnabled && this.audio) {
      this.audio.currentTime = 0;
      this.audio.play().catch(() => {}); // Ignorar errores de autoplay
    }
  }
}