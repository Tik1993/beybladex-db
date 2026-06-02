<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Beyblade X Project</title>
    <style>
        body {
            margin: 0;
            font-family: Arial, sans-serif;
            background: #0f172a;
            color: #e2e8f0;
        }

        .page {
            max-width: 1200px;
            margin: 0 auto;
            padding: 40px 20px 60px;
        }

        .hero {
            margin-bottom: 32px;
        }

        .hero h1 {
            margin: 0 0 8px;
            font-size: 2.5rem;
            color: #fff;
        }

        .hero p {
            margin: 0;
            color: #cbd5e1;
        }

        .grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 20px;
        }

        .card {
            background: rgba(255, 255, 255, 0.06);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 18px;
            padding: 20px;
            box-shadow: 0 12px 30px rgba(0, 0, 0, 0.2);
        }

        .card h2 {
            margin: 0 0 10px;
            font-size: 1.2rem;
            color: #fff;
        }

        .meta {
            font-size: 0.95rem;
            color: #cbd5e1;
            margin-bottom: 12px;
        }

        .section {
            margin-top: 12px;
            padding-top: 12px;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .label {
            font-size: 0.75rem;
            text-transform: uppercase;
            letter-spacing: 0.08em;
            color: #94a3b8;
            margin-bottom: 4px;
        }

        .value {
            color: #f8fafc;
            font-weight: 600;
        }

        .empty {
            color: #94a3b8;
        }

        .badge {
            display: inline-block;
            padding: 4px 10px;
            border-radius: 999px;
            background: #1e293b;
            color: #f8fafc;
            font-size: 0.8rem;
            margin-bottom: 12px;
        }

        .main-image {
            width: 100%;
            max-height: 220px;
            object-fit: cover;
            border-radius: 14px;
            margin: 12px 0;
            background: #1e293b;
        }

        .small-image {
            width: 72px;
            height: 72px;
            object-fit: contain;
            display: block;
            margin-top: 8px;
            background: #1e293b;
            border-radius: 12px;
            padding: 6px;
        }

        .image-row {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 10px;
            margin: 12px 0;
        }

        .image-box {
            min-height: 80px;
        }

        .item-image {
            width: 100%;
            height: 80px;
            object-fit: cover;
            border-radius: 12px;
            background: #1e293b;
        }

        .empty-image,
        .empty-main-image {
            width: 100%;
            height: 80px;
            border-radius: 12px;
            background: transparent;
        }
    </style>
</head>
<body>
    <div class="page">
        <div class="hero">
            <h1>Welcome to my Beyblade X Project</h1>
            <p>Browse official setups, blades, and parts in one place.</p>
        </div>
        <form method="GET" action="/" style="margin-bottom: 24px; display: flex; gap: 12px;">
        <input
            type="text"
            name="search"
            value="{{ $search ?? '' }}"
            placeholder="Search official setups..."
            style="flex: 1; padding: 12px 14px; border-radius: 12px; border: 1px solid #334155; background: #0f172a; color: #e2e8f0;"
        >
        <button
            type="submit"
            style="padding: 12px 18px; border: 0; border-radius: 12px; background: #2563eb; color: white; font-weight: 600;"
        >
            Search
        </button>
    </form>
        <div class="grid">
            @forelse ($officialSetups as $setup)
                <div class="card">
                    <div class="badge">{{ $setup->type }}</div>
                    <h2>{{ $setup->name }}</h2>
                    <div class="meta">{{ $setup->manufacturer }}</div>

                    @if ($setup->type === 'CX')
                        <div class="image-row">
                            <div class="image-box">
                                @if ($setup->cxLockChip?->img_url)
                                    <img src="{{ $setup->cxLockChip->img_url }}" alt="{{ $setup->cxLockChip->name }}" class="item-image">
                                @else
                                    <div class="empty-image"></div>
                                @endif
                            </div>
                            <div class="image-box">
                                @if ($setup->cxOverBlade?->img_url)
                                    <img src="{{ $setup->cxOverBlade->img_url }}" alt="{{ $setup->cxOverBlade->name }}" class="item-image">
                                @else
                                    <div class="empty-image"></div>
                                @endif
                            </div>
                            <div class="image-box">
                                @if ($setup->cxMetalBlade?->img_url)
                                    <img src="{{ $setup->cxMetalBlade->img_url }}" alt="{{ $setup->cxMetalBlade->name }}" class="item-image">
                                @else
                                    <div class="empty-image"></div>
                                @endif
                            </div>
                            <div class="image-box">
                                @if ($setup->cxAuxiliaryBlade?->img_url)
                                    <img src="{{ $setup->cxAuxiliaryBlade->img_url }}" alt="{{ $setup->cxAuxiliaryBlade->name }}" class="item-image">
                                @else
                                    <div class="empty-image"></div>
                                @endif
                            </div>
                        </div>
                    @else
                        @if ($setup->blade?->img_url)
                            <img src="{{ $setup->blade->img_url }}" alt="{{ $setup->blade->name }}" class="main-image">
                        @else
                            <div class="empty-main-image"></div>
                        @endif

                        <div class="section">
                            <div class="label">Blade</div>
                            <div class="value">{{ $setup->blade?->name ?? 'Not set' }}</div>
                        </div>
                    @endif

                    <div class="section">
                        <div class="label">Ratchet</div>
                        <div class="value">{{ $setup->ratchet?->name ?? 'Not set' }}</div>
                        @if ($setup->ratchet?->img_url)
                            <img src="{{ $setup->ratchet->img_url }}" alt="{{ $setup->ratchet->name }}" class="small-image">
                        @endif
                    </div>

                    <div class="section">
                        <div class="label">Bit</div>
                        <div class="value">{{ $setup->bit?->short_name ?? 'Not set' }}</div>
                        @if ($setup->bit?->img_url)
                            <img src="{{ $setup->bit->img_url }}" alt="{{ $setup->bit->short_name }}" class="small-image">
                        @endif
                    </div>
                </div>
            @empty
                <div class="card">
                    <h2>No official setups yet</h2>
                    <p class="empty">Add your first official setup to see it here.</p>
                </div>
            @endforelse
        </div>
    </div>
</body>
</html>