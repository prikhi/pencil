# Maintainer: Pavan Rikhi <pavan.rikhi@gmail.com>
pkgname=pencil
pkgver=2.0.12
pkgrel=1
pkgdesc="Sketching and GUI prototyping/wireframing tool"
arch=('any')
license=('GPL2')
url="http://github.com/prikhi/pencil"
install='pencil.install'

source=("https://github.com/prikhi/pencil/releases/download/v$pkgver/Pencil-$pkgver-linux-pkg.tar.gz")
sha256sums=('6f4cc1808faec42bd791e6d809131380b04a11d41db2fd9af83b115ae40a7165')
depends=('xulrunner')
optdepends=('pencil-android-lollipop-stencils-git: Android UI'
            'pencil-material-icons-git: Material Design Icons')

package() {
    cp -dr "$srcdir/evolus-pencil/usr" "$pkgdir"
    # fix permissions of directories
    chmod -R a+rX "$pkgdir"/*
}
