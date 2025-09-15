import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { GoogleMapsModule } from '@angular/google-maps';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterModule, GoogleMapsModule],
    template: `<router-outlet></router-outlet>`
})
export class AppComponent {}
