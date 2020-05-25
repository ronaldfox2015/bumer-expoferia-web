<?php

namespace AppBundle\Service\Base;

/**
 * Class SeoHead
 *
 * @package AppBundle\Service\Base
 * @author Joseph Marcilla <jbmarflo@gmail.com>
 * @copyright (c) 2017, Orbis
 */
class SeoHead
{
    public function getTitleSectionList($name) {
        return [
            'avisos'    => 'Puestos de trabajo en ' . $name,
            'perfil'    => $name . ' - Perfil Institucional',
            'galeria'   => $name . ' - Galería',
            'documentos'=> $name . ' - Documentos Descargables'
        ];
    }

    public function getDescriptionSectionList($name, $fairCategory = null)
    {
        return [
            'avisos' => sprintf(
                'Bienvenido a la feria virtual de trabajo más grande del Perú. Navega a ' .
                'través de nuestro listado de %s en %s, selecciona el puesto de trabajo que más se ajusta a tus ' .
                'habilidades y postula | ExpoAptitus 2019',
                $fairCategory,
                $name
            ),
            'perfil' => '',
            'galeria' => '',
            'documentos' => ''
        ];
    }
}