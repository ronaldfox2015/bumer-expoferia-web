<?php

namespace AppBundle\Service;

/**
 * Class PaginationService
 *
 * @package AppBundle\Service
 * @author Andy Ecca <andy.ecca@gmail.com>
 * @copyright (c) 2017, Orbis
 */
class PaginationService
{

    const SHOW_MAX_PAGES = 10;
    const LEFT_PAGES_INACTIVED = 4;

    protected $pageCurrentClass = 'is-current';

    protected $pageClass         = 'g-table_paginate_button';
    protected $pageFirstClass    = 'g-table_paginate_button--first';
    protected $pageLastClass     = 'g-table_paginate_button--last';
    protected $pageDisabledClass = 'g-table_paginate_button--disabled';
    protected $pageDotClass      = 'g-table_paginate_button--dots';
    protected $pageMobileClass   = 'g-btn--white';

    protected $total = 0;
    protected $numLinks;
    protected $page;
    protected $baseUri;

    public function __construct(
        $total,
        $page,
        $limit,
        $numLinks = 10,
        $baseUri
    )
    {
        $this->total = $total;
        $this->page = $page;
        $this->limit = $limit;
        $this->numLinks = $numLinks;
        $this->baseUri = $baseUri;
    }

    public function paginate()
    {
        $first = 1;
        $viewPages = array();
        $totalPage = ceil($this->total / $this->limit);
        $currentPage = $this->page;

        if ($totalPage <= self::SHOW_MAX_PAGES) {
            for ($page = 1; $page <= $totalPage; $page++){
                $viewPages[] = array('page' => $page, 'active' => $page == $currentPage, 'url' => $this->getPageUrl($page));
            }
        } else {
            if($currentPage <= self::LEFT_PAGES_INACTIVED){
                for ($page = $first; $page <= self::SHOW_MAX_PAGES; $page++) {
                    $viewPages[] = array('page' => $page, 'active' => $page == $currentPage, 'url' => $this->getPageUrl($page));
                }
            }else{
                if($currentPage >= $totalPage - self::LEFT_PAGES_INACTIVED){
                    for ($page = $totalPage - (self::SHOW_MAX_PAGES - 1); $page <= $totalPage; $page++) {
                        $viewPages[] = array('page' => $page, 'active' => $page == $currentPage, 'url' => $this->getPageUrl($page));
                    }
                }else{
                    for ($page = $currentPage - self::LEFT_PAGES_INACTIVED; $page <= $currentPage + (self::SHOW_MAX_PAGES - self::LEFT_PAGES_INACTIVED -1); $page++) {
                        $viewPages[] = array('page' => $page, 'active' => $page == $currentPage, 'url' => $this->getPageUrl($page));
                    }
                }
            }
        }

        $previusPage = $currentPage - 1;
        $nextPage = $currentPage + 1;

        $buttonsNavegation = array();

        if ($totalPage > 1) {
            if ($previusPage != 0) {
                $paramSeo['page'] = $first;
                $buttonsNavegation['first'] = array('page' => $first, 'disabled' => false, 'url' => $this->getPageUrl($first));
                $paramSeo['page'] = $previusPage;
                $buttonsNavegation['prev'] = array('page' => $previusPage, 'disabled' => false, 'url' => $this->getPageUrl($previusPage));
            } else {
                $buttonsNavegation['first'] = array('page' => 0, 'disabled' => true, 'url' => '');
                $buttonsNavegation['prev'] = array('page' => 0, 'disabled' => true, 'url' => '');
            }
        }elseif($totalPage == 1){
            $buttonsNavegation['first'] = array('page' => 0, 'disabled' => true, 'url' => '');
            $buttonsNavegation['prev'] = array('page' => 0, 'disabled' => true, 'url' => '');
        }

        if($totalPage > 1){
            if ($nextPage <= $totalPage) {
                $paramSeo['page'] = $nextPage;
                $buttonsNavegation['next'] = array('page' => $nextPage, 'disabled' => false, 'url' => $this->getPageUrl($nextPage));
                $paramSeo['page'] = $totalPage;
                $buttonsNavegation['last'] = array('page' => $totalPage, 'disabled' => false, 'url' => $this->getPageUrl($totalPage));
            } else {
                $buttonsNavegation['next'] = array('page' => 0, 'disabled' => true, 'url' => '');
                $buttonsNavegation['last'] = array('page' => 0, 'disabled' => true, 'url' => '');
            }
        }elseif($totalPage == 1){
            $buttonsNavegation['next'] = array('page' => 0, 'disabled' => true, 'url' => '');
            $buttonsNavegation['last'] = array('page' => 0, 'disabled' => true, 'url' => '');
        }

        return array('pages' => $viewPages, 'navigation' => $buttonsNavegation);
    }

    private function getPageUrl($page)
    {
        return $this->mergeQuerystring($this->baseUri, '?page=' . $page);
    }

    function mergeQuerystring($url, $query = null)
    {
        $parseUrl = parse_url($url);

        if (empty($parseUrl['query'])) {
            return $url . '?' . ltrim($query, '?');
        }

        parse_str($parseUrl['query'], $queryString);
        parse_str(parse_url($query, PHP_URL_QUERY), $newQueryString);

        $query = array_merge(
            $queryString,
            $newQueryString
        );

        return str_replace($parseUrl['query'], http_build_query($query), $url);
    }
}