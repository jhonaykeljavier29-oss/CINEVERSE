import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'map',
  standalone: true
})
export class MapPipe implements PipeTransform {
  transform(value: any[], property: string): any[] {
    if (!value || !Array.isArray(value) || !property) {
      return value;
    }
    
    return value.map(item => {
      // Soporte para propiedades anidadas (ej: 'person.name')
      const props = property.split('.');
      return props.reduce((obj, prop) => obj?.[prop], item);
    });
  }
}