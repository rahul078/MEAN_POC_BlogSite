import { Component,EventEmitter,Output, OnInit } from '@angular/core'
import { Post } from "../Posts.Model"
import { NgForm, ReactiveFormsModule, FormControl, Validators, FormGroup } from '@angular/forms';
import { PostsService } from '../Posts.Service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { mimeType } from "./post-create-mime-validator"

@Component({
  templateUrl : "./Posts-create.component.html",
  selector : "app-posts-create",
  styleUrls : ["Posts-create.component.css"]
})
export class PostCreateComponent implements OnInit{

  public mode = "create";
  private PostId : string;
  public post : Post;
  public form :FormGroup;
  public fileUrl : string;

  constructor(public postService : PostsService,public route: ActivatedRoute){}

  ngOnInit() {
    this.form = new FormGroup({
      header : new FormControl(null,{validators : [Validators.required]}),
      Content : new FormControl(null,{validators : [Validators.required]}),
      fileUrl : new FormControl(null, {
        validators: [Validators.required],asyncValidators: [mimeType]
      })
    });
    this.route.paramMap.subscribe((map :ParamMap) => {
      if(map.has("PostId")){
        this.mode = "edit";
        this.PostId = map.get("PostId");
        this.post = this.postService.getSinglePost(this.PostId);
        this.form.patchValue({
          header : this.post.header,
          Content : this.post.Content,
          fileUrl : this.post.imagePath
        });
      }
      else{
        this.mode = "create";
        this.PostId = null;
      }
    });
  }

  onImageChanged(event : Event){
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({fileUrl : file});
    this.form.updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () =>{
      this.fileUrl = reader.result.toString();
    };
    reader.readAsDataURL(file);
  }

  onSavePost()
 {
   if(this.form.invalid)
   {
     return;
  }
  if(this.mode === "create"){
    const PostJson : Post = {
      id:null,
      header : this.form.value.header,
       Content : this.form.value.Content,
       imagePath : null,
       creator : null
    };
    this.postService.addPost(PostJson, this.form.value.fileUrl);
  }else{
    const PostJson : Post = {
      id : this.PostId,
      header : this.form.value.header,
       Content : this.form.value.Content,
       imagePath : this.form.value.fileUrl,
       creator : null
    };
    if(PostJson.imagePath == this.post.imagePath)
    {
      this.postService.updatePost(PostJson, null);
    }
    else{
      this.postService.updatePost(PostJson, this.form.value.fileUrl);
    }
  }
  this.form.reset();
 }
}
