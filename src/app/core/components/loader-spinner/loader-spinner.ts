import { LoaderService } from '@/core/utils/ui/loader.service';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-loader-spinner',
  imports: [CommonModule],
  templateUrl: './loader-spinner.html',
  styleUrl: './loader-spinner.scss'
})
export class LoaderSpinner {
  constructor(public loaderService: LoaderService) {}
}
