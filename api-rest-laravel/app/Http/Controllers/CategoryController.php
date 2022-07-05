<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use App\Category;

class CategoryController extends Controller
{
    public function __construct(){
        $this->middleware("api.auth", ["except" => ["index", "show"]]);
    }

    public function index(){
        $categories = Category::all();
        return response()->json([
            "code" => 200,
            "status" => "success",
            "categories" => $categories
        ]);
    }

    public function show($id){
        $category = Category::find($id);
        if(is_object($category)){
            $data = [
                "code" => 200,
                "status" => "success",
                "category" => $category
            ]; 
        } else {
            $data = [
                "code" => 400,
                "status" => "error",
                "message" => "Category doesn't exists"
            ]; 
        }
        return response()->json($data,$data["code"]);
    }

    public function store(Request $request){
        // Take data from POST request
        $json = $request->input("json", null);
        $params_array = json_decode($json, true);

        if(!empty($params_array)){
            // Validate data
            $validate = \Validator::make($params_array, [
                "name" => "required|unique:categories"
            ]);

            // Save category
            if($validate->fails()){
                $data = [
                    "code" => 400,
                    "status" => "error",
                    "message" => "Category couldn't be save",
                    "errors" => $validate->errors()
                ];
            } else {
                $category = new Category();
                $category->name = $params_array["name"];
                $category->save();

                $data = [
                    "code" => 200,
                    "status" => "success",
                    "category" => $category
                ];
            }
        } else {
            $data = [
                "code" => 400,
                "status" => "error",
                "message" => "Category field empty"
            ];
        }        
        return response()->json($data,$data["code"]);
    }

    public function update($id, Request $request){
        $json = $request->input("json", null);
        $params_array = json_decode($json, true);

        if(!empty($params_array)){
            $validate = \Validator::make($params_array, [
                "name" => "required"
            ]);
            unset($params_array["id"]);
            unset($params_array["created_at"]);

            $category = Category::where("id", $id)->update($params_array);

            $data = [
                "code" => 201,
                "status" => "success",
                "category" => $id,
                "changes" => $params_array
            ];
        } else {
            $data = [
                "code" => 400,
                "status" => "error",
                "message" => "Category name mustn't be empty"
            ];
        }        
        return response()->json($data,$data["code"]);
    }
}
