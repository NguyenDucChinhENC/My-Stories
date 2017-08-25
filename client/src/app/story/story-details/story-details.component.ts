import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IStory } from '../shared/story.model';
import { StoryResolverService } from '../shared/story-resolver.service';
import { VoteService } from './vote.service';
import * as $ from 'jquery';
import { IMG_URL } from '../../constants';
import { TranslateService } from 'ng2-translate';
import { MdSnackBar, MdDialog } from '@angular/material';
import { EditStoryComponent } from './edit/edit.component';
import { StoryService } from '../shared/story.service';
import { FollowService } from '../shared/follow-story.server';
import { Response } from '@angular/http';

@Component({
  templateUrl: './story-details.component.html',
  styleUrls: ['./story-details.component.scss'],
  providers: [StoryResolverService, VoteService, StoryService, FollowService, MdSnackBar]
})

export class StoryDetailsComponent implements OnInit {

  testObj: any = {};

  story: IStory;
  image_url = IMG_URL;
  current_user: any;
  status_follow: any;
  public follow_title: String;
  commentMapping:
    {[k: string]: string} = {'=1': '# ' + this.translate.instant('single_story.comment'),
    'other': '# ' + this.translate.instant('single_story.comments')};
  voteMapping:
    {[k: string]: string} = {'=1': '# ' + this.translate.instant('single_story.vote'),
    'other': '# ' + this.translate.instant('single_story.votes')};

  constructor(private route: ActivatedRoute, private voteService: VoteService,
    private translate: TranslateService, private dialog: MdDialog, private _router: Router,
    private storyservice: StoryService, private followService: FollowService, private snackBar: MdSnackBar) {
  }

  ngOnInit() {
    this.story = this.route.snapshot.data['story'];
    this.getFollowStory(this.story.id);
    this.current_user = JSON.parse(localStorage.getItem('currentUser'));
    this.checkVoted();
  }

  getFollowStory(id :number){
    this.storyservice.getFollow(id, JSON.parse(localStorage.getItem('currentUser')).token)
      .subscribe(response => this.onSuccessgGetFollow(response));
  }
  onSuccessgGetFollow(response){
    this.status_follow = response;
    this.setTitleFollow(this.status_follow);
  }

  setTitleFollow(temp: any) {
    if (temp === false){
      this.follow_title = 'Follow'
    } else {
      this.follow_title = 'Unfollow'
    }
  }

  checkImageExist() {
    return !!this.story.picture;
  }

  onComment() {
    window.scroll(0, window.innerHeight);
    $('#cmt_target').focus();
  }

  onVote() {
    this.voteService.voteStory(this.story.id, this.current_user.token).subscribe(
      response => this.onVoteSuccess(response),
      response => this.onVoteError(response));
  }

  onVoteSuccess(response) {
    if (response) {
      const total_vote = JSON.parse(response._body).data.total_vote;
      this.story.total_vote = total_vote.total_vote;
      if ($('#heart').hasClass('voted')) {
        $('#heart').removeClass('voted');
      } else {
        $('#heart').addClass('voted');
      }
    }
  }

  onVoteError(response) {
    console.log(response);
  }

  checkVoted() {
    if (this.story.users_voted === null) {
      this.story.users_voted = [];
    };
    const user_voted = this.story.users_voted;

    if (user_voted === null) {
      return;
    };

    if (user_voted.find(user => user.id === this.current_user.id)) {
      $('#heart').addClass('voted');
    } else {
      $('#heart').removeClass('voted');
    }
  }

  edit() {
    const height = 649;
    const width = 800;

    const dialogRef = this.dialog.open(EditStoryComponent, {
      height: height + 'px',
      width: width + 'px'
    });
    dialogRef.componentInstance.story = this.story;
  }

  delete() {
    this.storyservice.deleteStory(this.story.id, this.current_user.token).
      subscribe(response => this.onDeleteSuccess(response),
      response => this.onDeleteError(response));
  }

  onDeleteSuccess(response) {
    if (response) {
      this._router.navigate(['/']);
    }
  }

  onDeleteError(response) {
    console.log(response);
    this.snackBar.open('Delete Error!, Please try again!', '', {
      duration: 5000
    });
  }

  onCloneButtom(id_story: number){
    console.log(this.current_user.token)
    this.storyservice.cloneStory(id_story, this.current_user.token).
      subscribe(response => this.onCloneSuccess(response))
  }

  onCloneSuccess(response){
    var jsonObject : any = JSON.parse(response._body);
    let snackBarRef = this.snackBar.open('Clone Success', 'Open your profile', {
      duration: 2000,
    });
    snackBarRef.onAction().subscribe(() => 
    {
      console.log(jsonObject);
      this._router.navigate(['/user']);
    }
  )
  }

  onButtomFollow(id: any) {
    console.log(this.status_follow)
    if (this.status_follow === false){
      this.followStory(id);
    } else {
      this.unfollowstory(id);
    }
  }

  followStory(id: number){
    this.current_user = JSON.parse(localStorage.getItem('currentUser'));
    this.followService.createFollow(id, this.current_user.token).subscribe(response => this.followPath(response));
  }

  followPath(response){
    console.log('hihi');
    this.follow_title = 'Unfollow';
    this.getFollowStory(this.story.id);
  }

  unfollowstory(id: number){
    this.current_user = JSON.parse(localStorage.getItem('currentUser'));
    this.followService.destroyFollow(this.status_follow, id, this.current_user.token).subscribe(response => this.unFollowPath(response));
  }

  unFollowPath(response){
    this.follow_title = 'Follow';
    this.getFollowStory(this.story.id);
  }
}
