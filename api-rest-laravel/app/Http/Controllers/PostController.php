<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use App\Post;
use App\Helpers\JwtAuth;

class PostController extends Controller
{
    public function __construct(){
        $this->middleware("api.auth", ["except" => ["index", "show", "getImage", "getPostsByCategory", "getPostsByUser"]]);
    }

    private function getUser($request){
        $jwtAuth = new JwtAuth();
        $token = $request->header("Authorization", null);
        $user = $jwtAuth->checkToken($token, true);
        return $user;
    }

    public function index(){
        $posts = Post::all();
        return response()->json([
            "code" => 200,
            "status" => "success",
            "posts" => $posts
        ]);
    }

    public function show($id){
        $post = Post::find($id)->load("category")->load("user");
        if(is_object($post)){
            $data = [
                "code" => 200,
                "status" => "success",
                "post" => $post
            ]; 
        } else {
            $data = [
                "code" => 400,
                "status" => "error",
                "message" => "Post doesn't exists"
            ]; 
        }
        return response()->json($data,$data["code"]);
    }

    public function store(Request $request){
        $json = $request->input("json", null);
        $params = json_decode($json);
        $params_array = json_decode($json, true);

        if(!empty($params_array)){
            $user = $this->getUser($request);

            $validate = \Validator::make($params_array, [
                "title" => "required",
                "content" => "required",
                "category_id" => "required",
                "image" => "required",
            ]);

            if($validate->fails()){
                $data = [
                    "code" => 400,
                    "status" => "error",
                    "message" => "Post couldn't be saved",
                    "errors" => $validate->errors()
                ]; 
            } else {
                $post = new Post();
                $post->user_id = $user->sub;
                $post->category_id = $params->category_id;
                $post->title = $params->title;
                $post->content = $params->content;               
                $post->image = $params->image;              
                $post->save(); 

                $data = [
                    "code" => 200,
                    "status" => "success",
                    "post" => $post
                ];              
            }
        } else{
            $data = [
                "code" => 400,
                "status" => "error",
                "message" => "Post field are empty"
            ];
        }
        return response()->json($data,$data["code"]);
    }

    public function update($id, Request $request){
        $user = $this->getUser($request);
        $json = $request->input("json", null);
        $params_array = json_decode($json, true);

        if(!empty($params_array)){
            $validate = \Validator::make($params_array, [
                "title" => "required",
                "content" => "required",
                "category_id" => "required",
            ]);

            if($validate->fails()){
                $data = [
                    "code" => 400,
                    "status" => "error",
                    "message" => "Post couldn't be updated",
                    "errors" => $validate->errors()
                ];
            } else {
                unset($params_array["id"]);
                unset($params_array["user_id"]);
                unset($params_array["user"]);
                unset($params_array["created_at"]);
    
                $post = Post::where("id", $id)->where("user_id", $user->sub)->first();
                if(!empty($post) && is_object($post)){
                    $post->update($params_array);
                    $data = [
                        "code" => 201,
                        "status" => "success",
                        "post" => $id,
                        "changes" => $params_array
                    ];             
                } else {
                    $data = [
                        "code" => 400,
                        "status" => "error",
                        "message" => "You are not the post's owner",
                    ];
                } 
            }            
        } else {
            $data = [
                "code" => 400,
                "status" => "error",
                "message" => "Post fields mustn't be empty"
            ];
        }
        return response()->json($data,$data["code"]);
    }

    public function destroy($id, Request $request){
        $user = $this->getUser($request);
        
        $post = Post::where("id", $id)->where("user_id", $user->sub)->first();

        if(!empty($post)){
            $post->delete();
            $data = [
                "code" => 200,
                "status" => "success",
                "message" => "Post deleted",
            ];
        } else {
            $data = [
                "code" => 400,
                "status" => "error",
                "message" => "Post doesn't exist in DB or you aren't the post owner",
            ];
        }        
        return response()->json($data,$data["code"]); 
    }

    public function upload(Request $request){
        $image = $request->file("file0");
        
        $validate  = \Validator::make($request->all(), [
            "file0" => "required|mimes:jpg,jpeg,png,gif"
        ]);

        if(!$image || $validate->fails()){
            $data = [
                "code" => 400,
                "status" => "error",
                "message" => "Image couldn't be upload",
                "errors" => $validate->errors()
            ];
        } else {
            $image_name = time().$image->getClientOriginalName();
            \Storage::disk("images")->put($image_name, \File::get($image));
            $data = [
                "code" => 200,
                "status" => "success",
                "image" => $image_name
            ];
        }
        return response()->json($data,$data["code"]); 
    }    

    public function getImage($filename){
        $isset = \Storage::disk("images")->exists($filename);
        if($isset){
            $file = \Storage::disk("images")->get($filename);
            return new Response($file, 200);
        } else {
            $data = array(
                "code" => 404,
                "status" => "error",
                "message" => "Image doesn't exist in DB"
            );
            return response()->json($data,$data["code"]);
        }
    }

    public function getPostsByCategory($id){
        $posts = Post::where("category_id", $id)->get();
        $data = array(
            "code" => 200,
            "status" => "success",
            "posts" => $posts
        );
        return response()->json($data,$data["code"]);
    }

    public function getPostsByUser($id){
        $posts = Post::where("user_id", $id)->get();
        $data = array(
            "code" => 200,
            "status" => "success",
            "posts" => $posts
        );
        return response()->json($data,$data["code"]); 
    }
}
