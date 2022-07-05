<?php
namespace App\Helpers;

use Firebase\JWT\JWT;
use Illuminate\Support\Facades\DB;
use App\User;

class JwtAuth{
    public $key;
    public function __construct(){
        $this->key = "This_is_a_secret_key-974561823";
    }

    public function signup($email, $password, $getToken = null){
        // Search if user exists with credentials
        $user = User::where([
            "email" => $email,
            "password" => $password
        ])->first();

        // Validation
        $signup = false;
        if(is_object($user)){
            $signup = true;
        }

        // Generate user token
        if($signup){
            $token = array(
                "sub"           => $user->id,
                "email"         => $user->email,
                "name"          => $user->name,
                "surname"       => $user->surname,
                'description'   => $user->description, 
                'image'         => $user->image, 
                "iat"           => time(),
                "exp"           => time()+(24*60*60),
            );
            $jwt = JWT::encode($token, $this->key, "HS256");
            $decoded = JWT::decode($jwt, $this->key, ["HS256"]);

            // Return encoded data or token
            if(is_null($getToken)){
                $data = $jwt;
            } else {
                $data = $decoded;
            }
        } else {
            $data = array(
                "status" => "error",
                "message" => "Login failed"
            );
        }
        return $data;
    }

    public function checkToken($jwt, $getIdentity = false){
        $auth = false;

        try {
            $jwt = str_replace('"', '',$jwt);
            $decoded = JWT::decode($jwt, $this->key, ["HS256"]);
        } catch (\UnexpectedValueException $e) {
            $auth = false;
        } catch (\DomainException $e){
            $auth = false;
        }

        if(!empty($decoded) && is_object($decoded) && isset($decoded->sub)){
            $auth = true;
        } else{
            $auth = false;
        }

        if($getIdentity){
            return $decoded;
        }

        return $auth;
    }
}