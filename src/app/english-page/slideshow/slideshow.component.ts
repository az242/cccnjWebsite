import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-slideshow',
  templateUrl: './slideshow.component.html',
  styleUrls: ['./slideshow.component.scss']
})
export class SlideshowComponent implements OnInit {
  startIndex = 0;
  images = ['../../assets/cny.jpg', '../../assets/volleyball.jpg', '../../assets/volleyball.jpg'];
  constructor() {

  }

  ngOnInit(): void {
  }

}
