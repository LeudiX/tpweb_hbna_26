from django.http import HttpResponse


class CorsMiddleware:
    """Añade las cabeceras CORS que necesita la API."""

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        is_preflight = (
            request.method == "OPTIONS"
            and request.headers.get("Access-Control-Request-Method")
        )
        if is_preflight:
            response = HttpResponse(status=204)
            response["Access-Control-Allow-Methods"] = (
                "GET,HEAD,PUT,PATCH,POST,DELETE"
            )
            requested_headers = request.headers.get(
                "Access-Control-Request-Headers"
            )
            if requested_headers:
                response["Access-Control-Allow-Headers"] = requested_headers
        else:
            response = self.get_response(request)

        response["Access-Control-Allow-Origin"] = "*"
        return response
