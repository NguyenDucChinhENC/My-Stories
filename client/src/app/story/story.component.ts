import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-story',
  template: `
    <div class="hdd">
    <router-outlet></router-outlet>
    </div>`,
  styles: [`
    .hdd {
      background-image: url("http://1.bp.blogspot.com/-5XIQOyvCREA/VKo2yQl7RdI/AAAAAAAASPg/vu3vLbqbhEY/s1600/Android-Lollipop-wallpapers-Wall1.png");
      height: 100vh;
      background-size: cover;
    }
  `],
  providers: [ ]

})
export class StoryComponent implements OnInit {
  public stories: any
  constructor() {}

  ngOnInit() {

  }

  onSuccess(response) {
    const stories = response.data.stories;
    console.log(this.stories);
  }
}
