<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use App\User;

class UserController extends Controller
{
    public function register(Request $request){
        $json = $request->input("json", null);
        $params = json_decode($json); 
        $params_array = json_decode($json,true); 

        if(!empty($params) && !empty($params_array)){
            $params_array = array_map("trim",$params_array);
            
            $validate = \Validator::make($params_array,[
            "name" => "required|alpha",
            "surname" => "required|alpha",
            "email" => "required|email|unique:users",
            "password" => "required",
            ]);

            if($validate->fails()){
                $data = array(
                    "code" => 404,
                    "status" => "error",
                    "message" => "The user hasn't been created",
                    "errors" => $validate->errors()
                );
            } else {
                $pwd = hash("sha256",$params->password);

                $user = new User();
                $user->name = $params_array["name"];
                $user->surname = $params_array["surname"];
                $user->email = $params_array["email"];
                $user->password =  $pwd;
                $user->role =  "ROLE_USER";
                                
                $user->save();

                $data = array(
                    "code" => 200,
                    "status" => "success",
                    "message" => "The user has been created",
                    "user" => $user
                );
            }
        } else {
            $data = array(
                "code" => 404,
                "status" => "error",
                "message" => "The data on the request isn't correct",
            );
        }
        return response()->json($data, $data["code"]);
    }

    public function login(Request $request){
        $jwtAuth = new \JwtAuth();

        $json = $request->input("json", null);
        $params = json_decode($json);
        $params_array = json_decode($json, true);

        $validate = \Validator::make($params_array,[
            "email" => "required|email",
            "password" => "required",
        ]);

        if($validate->fails()){
            $signup = array(
                "code" => 404,
                "status" => "error",
                "message" => "User can't be validated",
                "errors" => $validate->errors()
            );
        } else {
            $pwd = hash("sha256",$params->password);

            $signup = $jwtAuth->signup($params->email, $pwd);
            if(isset($params->getToken)){
                $signup = $jwtAuth->signup($params->email, $pwd, true);
            }
        }
        return response()->json($signup, 200);
    }

    public function update(Request $request){
        $token = $request->header("Authorization");
        $jwtAuth = new \JwtAuth();
        $checkToken = $jwtAuth->checkToken($token);

        $json = $request->input("json", null);
        $params_array = json_decode($json, true);

        if($checkToken && !empty($params_array)){
            $user = $jwtAuth->checkToken($token, true);

            $validate = \Validator::make($params_array,[
                "name" => "required|alpha",
                "surname" => "required|alpha",
                "email" => "required|email|unique:users".$user->sub
            ]);

            unset($params_array["id"]);
            unset($params_array["role"]);
            unset($params_array["created_at"]);
            unset($params_array["remember_token"]);

            $user_updated = User::where("id", $user->sub)->update($params_array);
            
            $data = array(
                "code" => 200,
                "status" => "success",
                "message" => "User authenticated",
                "user" => $user,
                "changes" => $params_array
            );
        } else {
            $data = array(
                "code" => 400,
                "status" => "error",
                "message" => "User isn't authenticated"
            );
        }
        return response()->json($data,$data["code"]);
    }

    public function upload(Request $request){
        $image = $request->file("file0");

        $validate  = \Validator::make($request->all(), [
            "file0" => "required|mimes:jpg,jpeg,png,gif"
        ]);

        if(!$image || $validate->fails()){
            $data = array(
                "code" => 400,
                "status" => "error",
                "message" => "Image couldn't be uploaded"
            );
        } else {
            $image_name = time().$image->getClientOriginalName();
            \Storage::disk("users")->put($image_name, \File::get($image));
            $data = array(
                "code" => 200,
                "status" => "success",
                "image" => $image_name
            );
        }        
        return response()->json($data,$data["code"]);
    }

    public function getImage($filename){
        $isset = \Storage::disk("users")->exists($filename);
        if($isset){
            $file = \Storage::disk("users")->get($filename);
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

    public function detail($id){
        $user = User::find($id);
        if(is_object($user)){
            $data = array(
                "code" => 200,
                "status" => "success",
                "user" => $user
            );
        } else {
            $data = array(
                "code" => 404,
                "status" => "error",
                "message" => "User doesn't exist in DB"
            );
        }
        return response()->json($data,$data["code"]);
    }
}
