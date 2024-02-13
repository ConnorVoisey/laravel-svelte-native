<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Todo;
use Illuminate\Support\Facades\Auth;
use Ramsey\Uuid\Rfc4122\UuidV7;

class TodoController extends Controller
{
    /**
     * Display a listing of the authenticated user's todos.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $user = Auth::user();
        $todos = $user->todos;
        return response()->json(['todos' => $todos], 200);
    }

    /**
     * Store a newly created todo for the authenticated user.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $request->validate([
            'id' => 'string',
            'task' => 'required|string',
            'completed' => 'boolean',
        ]);

        $user = Auth::user();
        $todo = $user->todos()->create([
            'id' => $request->id ?? UuidV7::uuid7(),
            'task' => $request->task,
            'completed' => $request->completed ?? false,
        ]);

        return response()->json(['todo' => $todo], 201);
    }

    /**
     * Display the specified todo belonging to the authenticated user.
     *
     * @param  string  $id
     * @return \Illuminate\Http\Response
     */
    public function show(string $id)
    {
        $user = Auth::user();
        $todo = $user->todos()->find($id);
        if (!$todo) {
            return response()->json(['error' => 'Todo not found'], 404);
        }
        return response()->json(['todo' => $todo], 200);
    }

    /**
     * Update the specified todo belonging to the authenticated user.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  string  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, string $id)
    {
        $request->validate([
            'task' => 'string',
            'completed' => 'boolean',
        ]);

        $user = Auth::user();
        $todo = $user->todos()->find($id);
        if (!$todo) {
            return response()->json(['error' => 'Todo not found'], 404);
        }

        $todo->fill($request->all());
        $todo->save();

        return response()->json(['todo' => $todo], 200);
    }

    /**
     * Remove the specified todo belonging to the authenticated user.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $user = Auth::user();
        $todo = $user->todos()->find($id);
        if (!$todo) {
            return response()->json(['error' => 'Todo not found'], 404);
        }

        $todo->delete();
        return response()->json(['message' => 'Todo deleted successfully'], 200);
    }
}
