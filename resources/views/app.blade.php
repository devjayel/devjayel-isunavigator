<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8" />
    <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0, maximum-scale=1.0"
    />
    <link rel="icon" href={{asset("/favicon.png")}} type="image/x-icon"/>
    @viteReactRefresh
    @vite('resources/js/app.jsx')
    @routes
    @inertiaHead
</head>

<body>
    @inertia
</body>

</html>
