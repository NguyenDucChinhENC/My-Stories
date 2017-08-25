import { Component, OnInit } from '@angular/core';
import { User } from './user';
import { InfoUserService } from './info-user.service';
import { MdTooltipModule } from '@angular/material';
import { ActivatedRoute , Router } from '@angular/router';
import * as $ from 'jquery';
import { LoadingComponent } from '../loading.component';
import { MdSnackBar, MdDialog } from '@angular/material';
import { IMG_URL } from '../constants';

@Component({
  selector: 'app-info-user',
  templateUrl: './info-user.component.html',
  styleUrls: ['./info-user.components.scss'],
  providers: [InfoUserService, MdTooltipModule, MdSnackBar]
})

export class InfoUserComponent implements OnInit {
  current_user: any;
  following: any[];
  user: User;
  user_id: number;
  user_name: string;
  user_email: string;
  user_followed: boolean;
  user_followed_status: String;
  relastionship_id: number;
  stories: any;
  position = 'before';
  constructor(private infoUser: InfoUserService, private route: ActivatedRoute,
    private dialog: MdDialog, private router: Router, private snackBar: MdSnackBar) { }

  ngOnInit() {
    this.getDataUser();
  }

  getDataUser(){
    if (localStorage.getItem('currentUser')) {
      if (this.route.snapshot.params['id']) {
        this.user_id = +this.route.snapshot.params['id'];
        this.current_user = JSON.parse(localStorage.getItem('currentUser'));
        this.infoUser.getInforUser(+this.route.snapshot.params['id'], this.current_user.token).
          subscribe(response => this.onSuccess(response));
      } else {
        this.current_user = JSON.parse(localStorage.getItem('currentUser'));
        this.user_id = this.current_user.id;
        this.infoUser.getInforUser(this.current_user.id, this.current_user.token).
          subscribe(response => this.onSuccess(response));
      }
    } else {
      location.href = '';
    }
  }

  onFollowButtom(id: number){
    if (this.user_followed != false ) {
      this.onUnfollow(id);
    } else {
      this.onFollow(id);
    }
  }

  onFollow(id: number) {
    console.log(typeof id);
    this.current_user = JSON.parse(localStorage.getItem('currentUser'));
    this.infoUser.createFollow(id, this.current_user.token).subscribe(response => this.followpath(response));
  }

  onUnfollow(id: number) {
    this.current_user = JSON.parse(localStorage.getItem('currentUser'));
    this.infoUser.destroyFollow(this.relastionship_id, id, this.current_user.token).subscribe(response => this.unfollowpath(response));
  }

  unfollowpath(response){
    this.user_followed = false;
    this.user_followed_status = 'Follow';
  }

  followpath(response){
    this.user_followed_status = 'Unfollow';
    this.user_followed = true;
    this.getDataUser();
  }

  checkPageCurrentUser() {
    if (JSON.parse(localStorage.getItem('currentUser')).id === this.user_id) {
      return true
    };
    return false;
  }

  onSuccess(response) {
    const user = response.data.user;
    this.user = new User(user.id, user.name, user.email, user.avatar, user.stories, user.following_user);
    this.following = this.user.following;
    this.user_name = user.name;
    this.user_email = user.email;
    this.stories = user.stories;
    this.user_followed = response.data.followed;
    if (this.user_followed  === false) {
      this.user_followed_status = 'Follow'
    } else {
      this.user_followed_status = 'Unfollow',
      this.relastionship_id = response.data.followed;
    }
    if (this.user.avatar) { 
      $('#avatar').attr('src', IMG_URL + this.user.avatar);
    }
  }

  chooseImage(id: string) {
    $(id).trigger('click');
  }

  onChange(e) {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = this.changeImage.bind(this);
      reader.readAsDataURL(e.target.files[0]);
    }
  }

  changeImage(e) {
    const image = <FileReader> e.target;
    const ava = {
      user: {
        avatar: image.result
      }
    };
    this.infoUser.changeAvatar(ava, this.current_user.id, this.current_user.token).
      subscribe(response => this.onChangeSuccess(response, image),
      response => this.onChangeError(response));
    this.showAlert();
  }

  onChangeSuccess(response, image) {
    this.dialog.closeAll();
    if (response) {
      $('#avatar').attr('src', image.result);
      console.log(image);
    }
  }

  onChangeError(response) {
    this.dialog.closeAll();
    this.snackBar.open('Change Avatar Error!, Please try again!', '', {
      duration: 5000
    });
  }

  showAlert() {
    const alertdialog = this.dialog.open(LoadingComponent, {
      height: '115px',
      width: '220px'
    });
    alertdialog.disableClose = true;
  }
}
