<!DOCTYPE html>
<html>
<head>
    <title>Blades</title>
</head>
<body>
    <h1>Blade List</h1>

    <ul>
        @foreach ($blades as $blade)
            <li>{{ $blade['name'] }} - {{ $blade['color'] }}</li>
        @endforeach
    </ul>
</body>
</html>