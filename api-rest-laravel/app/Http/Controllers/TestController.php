<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Post;
use App\Category;

class TestController extends Controller
{
    public function testORM(){
        $categories = Category::all();
        foreach($categories as $category){
            echo "<h1>{$category->name}</h1>";
            foreach($category->posts as $post){
                echo "<h3 style='color:gray;'>{$post->title}</h3>";
            }
            echo "<hr>";
        }
        die();
    }
}