<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ServiceCategoryResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => (string) $this->id,
            'slug' => $this->slug,
            'name' => $this->name,
            'shortDescription' => $this->short_description,
            'group' => $this->group,
            'iconName' => $this->icon_name,
            'status' => $this->status,
            'isEnabled' => (bool) $this->is_enabled,
            'isVisible' => (bool) $this->is_visible,
            'providerStatusNote' => $this->provider_status_note,
            'minAmountNgn' => number_format((float) $this->min_amount_ngn, 2, '.', ''),
            'maxAmountNgn' => number_format((float) $this->max_amount_ngn, 2, '.', ''),
        ];
    }
}
