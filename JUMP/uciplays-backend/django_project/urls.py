from django.urls import include, path, re_path

from sports import static_views


urlpatterns = [
    path("api/", include("sports.urls")),
    path("jump", static_views.jump_index, name="jump-index-no-slash"),
    path("jump/", static_views.jump_index, name="jump-index"),
    re_path(r"^jump/(?P<asset_path>.+)$", static_views.jump_asset, name="jump-asset"),
    re_path(r"^assets/(?P<asset_path>.+)$", static_views.logo_asset, name="logo-asset"),
    re_path(r"^img/(?P<asset_path>.+)$", static_views.faculty_image, name="faculty-image"),
]
