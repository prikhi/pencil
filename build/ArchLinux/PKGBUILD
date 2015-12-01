# Maintainer: Pavan Rikhi <pavan.rikhi@gmail.com>
pkgname=pencil
pkgver=2.0.15
pkgrel=1
pkgdesc="Sketching and GUI prototyping/wireframing tool"
arch=('any')
license=('GPL2')
url="http://github.com/prikhi/pencil"
install='pencil.install'

source=("https://github.com/prikhi/pencil/releases/download/v$pkgver/Pencil-$pkgver-linux-pkg.tar.gz")
sha256sums=('be338558b613f51506337a2c7c80f209e8644656c2925f41c294e2872feabc3b')
depends=('xulrunner')
optdepends=('pencil-android-lollipop-stencils-git: Android UI'
            'pencil-material-icons-git: Material Design Icons')

package() {
    cp -dr "$srcdir/evolus-pencil/usr" "$pkgdir"
    # fix permissions of directories
    chmod -R a+rX "$pkgdir"/*
}
