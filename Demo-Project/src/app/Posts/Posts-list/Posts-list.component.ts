import { Component, OnInit, OnDestroy } from "@angular/core"
import { PostsService } from '../Posts.Service'
import { Post } from '../Posts.Model'
import { Subscription, SubscriptionLike } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  templateUrl : './Posts-list.component.html',
  selector : "app-posts-list",
  styleUrls : ["Posts-list.component.css"]
})
export class Postslist implements OnInit, OnDestroy{

  public userID : string;
  private postSubscription : Subscription;
  private authSubscription : Subscription;
  public totalPages = 10;
  public pageSize = 2;
  public currentPage = 1;
  public pageSizeOptions = [1,2,5,10];
  DisplayList : Post[];
  userAuthStatus = false;

  constructor(public postService : PostsService, public authService : AuthService){
    this.DisplayList =[];
  }

  ngOnInit(){
    this.postService.getPost(this.pageSize,this.currentPage);
    this.userID = this.authService.getUserID();
    this.postSubscription = this.postService.getPostUpdatedListener()
      .subscribe((postData : {postList:Post[], numberOfPosts : number}) => {
        this.DisplayList = postData.postList;
        this.totalPages = postData.numberOfPosts;
      });
    this.userAuthStatus = this.authService.getIsAuthenticated();
    this.authSubscription = this.authService.getAuthStatusListener().subscribe(authStatus => {
      this.userAuthStatus = authStatus;
      this.userID = this.authService.getUserID();
    });
  }

  onPageChanged(pageEvent : PageEvent){
    this.currentPage = pageEvent.pageIndex + 1;
    this.pageSize = pageEvent.pageSize;
    this.postService.getPost(this.pageSize,this.currentPage);
  }

  onDelete(id : string){
    this.postService.deletePost(id).subscribe(() => {
      this.postService.getPost(this.pageSize , this.currentPage);
    });
  }

  ngOnDestroy(){
    this.postSubscription.unsubscribe();
    this.authSubscription.unsubscribe();
  }
}
