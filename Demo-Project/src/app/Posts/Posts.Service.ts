import { Subject } from 'rxjs';
import { Post } from './Posts.Model';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

import { environment } from "../../environments/environment";

const BACKEND_URL = environment.BackendURL + "/posts/";

@Injectable({providedIn : "root"})
export class PostsService{

  private postList : Post[] = [];
  private postUpdated = new Subject<{postList:Post[], numberOfPosts : number}>();

  constructor(private httpClient : HttpClient, private router : Router){}

  getPost(pageSize:number, pagenumber:number){

    const queryParams = `?pageSize=${pageSize}&pageNumber=${pagenumber}`;
    this.httpClient.get<{message : string, posts : any, numberOfPosts : number}>
    (BACKEND_URL+queryParams)
    .pipe(map((postData)=>{
      return {posts : postData.posts.map(post => {
        return {
          header : post.header,
          Content : post.Content,
          id : post._id,
          imagePath : post.imagePath,
          creator : post.creator
      };
    }), maxPosts : postData.numberOfPosts
    }}))
    .subscribe((postDataTransformed) =>{
        this.postList = postDataTransformed.posts;
        this.postUpdated.next({postList:[...this.postList], numberOfPosts : postDataTransformed.maxPosts});
    });
  }

  getPostUpdatedListener(){
    return this.postUpdated.asObservable();
  }

  addPost(newPost:Post, image: File){
    const postData = new FormData();
    postData.append("header", newPost.header);
    postData.append("Content", newPost.Content);
    postData.append("image", image, newPost.header);
    console.log(image.name);
    this.httpClient.post<{message:string, post :Post}>(BACKEND_URL,postData)
    .subscribe(responseData => {
      this.router.navigate(["/"]);
    });
  }

  updatePost(PostJson: Post, image: File) {
    let postData;
    if(image!=null){
      postData = new FormData();
      postData.append("header", PostJson.header);
      postData.append("Content", PostJson.Content);
      postData.append("image", image);
    }
    this.httpClient.put<{message : string, imageUrl : string}>(BACKEND_URL+PostJson.id, ((image!=null)?postData:PostJson) )
      .subscribe(responseData => {
        this.router.navigate(["/"]);
      });
  }

  deletePost(id: string){
    return this.httpClient.delete<{message:string}>(BACKEND_URL+id);
  }

  getSinglePost(id : string){
    console.log(this.postList);
    return this.postList.find(post => post.id == id);
  }
}
