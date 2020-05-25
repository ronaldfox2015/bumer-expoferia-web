<?php

namespace AppBundle\Service\Fair;

/**
 * Class StandService
 *
 * @package AppBundle\Service\Fair
 * @author Andy Ecca <andy.ecca@gmail.com>
 * @copyright (c) 2017, Orbis
 */
class StandService
{
    protected $fairService;

    public function __construct(FairService $fairService)
    {
        $this->fairService = $fairService;
    }

    public function getInfoStand($fairId, $companySlug, $category = null)
    {
        $company       = $this->fairService->getCompanyDetail($fairId, $companySlug, $category);
        $amphitryon    = $this->fairService->getAmphitryonData($company['stand']['amphitryon']);
        $configuration = $this->fairService->getModelRules($company['stand']['model_id']);

        $configuration['imageStands']['amphitryon']['source'] = $amphitryon['data']['image'];

        $images = $company['stand']['images'];
        $colors = $company['stand']['colors'];

        foreach($configuration['imageStands'] as $imageType => $imageData) {
            $key = array_search('image_'.$imageType, array_column($images, 'type'));
            if ($key > -1) {
                $configuration['imageStands'][$imageType]['source'] = $images[$key]['link'];
            }
        }

        foreach ($configuration['pathsStands'] as $pathType => $pathData) {
            $configuration['pathsStands'][$pathType]['color'] =
                !empty($colors[$pathData['type']]) ? $colors[$pathData['type']] : '#3088C8';
        }

        if (!empty($company['stand']['video'])) {
            $company['stand']['video'] = str_replace('watch?v=','embed/', $company['stand']['video']);
        }
        
        $company['show_more_information'] = $this->hasAdditionalInformation($company);
        $company['trade_name'] = trim($company['trade_name']);
        
        return [
          'configuration' => $configuration,
          'company' => $company
        ];
    }

    private function hasAdditionalInformation($company)
    {
        $information = array_filter([
            $company['social_media'],
            $company['image_gallery'],
            $company['profile'],
            $company['latitude'],
            $company['longitude'],
            $company['stand']['video']
        ]);
        
        return !empty($information);
    }
}