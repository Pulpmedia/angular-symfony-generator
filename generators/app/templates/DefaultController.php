<?php

namespace AppBundle\Controller;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;

class DefaultController extends Controller
{
    /**
     * @Route("/", name="homepage")
     */
    public function indexAction(Request $request, $id = null)
    {

        $baseUrl = $request->getScheme() . '://' . $request->getHttpHost() . $request->getBasePath();

        // replace this example code with whatever you need
        return $this->render('<%= indexLogicalName %>', array(
          'baseUrl' => $baseUrl
        ));
    }
}
