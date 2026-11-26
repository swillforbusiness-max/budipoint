<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;

class RegisterRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'fullName' => ['required', 'string', 'min:3', 'max:120'],
            'email' => ['required', 'email', 'max:160', 'unique:users,email'],
            'phoneNumber' => ['required', 'string', 'min:7', 'max:30'],
            'password' => ['required', 'string', 'min:8'],
            'passwordConfirmation' => ['required', 'same:password'],
        ];
    }
}
