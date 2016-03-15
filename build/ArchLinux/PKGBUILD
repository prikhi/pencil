# Maintainer: Pavan Rikhi <pavan.rikhi@gmail.com>
pkgname=pencil
pkgver=2.0.18
pkgrel=1
pkgdesc="Sketching and GUI prototyping/wireframing tool"
arch=('any')
license=('GPL2')
url="http://github.com/prikhi/pencil"
install='pencil.install'

source=("https://github.com/prikhi/pencil/releases/download/v$pkgver/Pencil-$pkgver-linux-pkg.tar.gz")
sha256sums=('8cce99f00cf725914567868cda2217b0d475e5841d990e287722282bd68a1374')
depends=('xulrunner')
optdepends=('pencil-android-lollipop-stencils-git: Android UI'
            'pencil-material-icons-git: Material Design Icons')

package() {
    cp -dr "$srcdir/evolus-pencil/usr" "$pkgdir"
    # fix permissions of directories
    chmod -R a+rX "$pkgdir"/*
}
