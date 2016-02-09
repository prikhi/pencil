# Maintainer: Pavan Rikhi <pavan.rikhi@gmail.com>
pkgname=pencil
pkgver=2.0.16
pkgrel=1
pkgdesc="Sketching and GUI prototyping/wireframing tool"
arch=('any')
license=('GPL2')
url="http://github.com/prikhi/pencil"
install='pencil.install'

source=("https://github.com/prikhi/pencil/releases/download/v$pkgver/Pencil-$pkgver-linux-pkg.tar.gz")
sha256sums=('3a2ee87e4d6de053b5dc2439e93a3d16effe06f805a215a47ba525eefbc88d02')
depends=('xulrunner')
optdepends=('pencil-android-lollipop-stencils-git: Android UI'
            'pencil-material-icons-git: Material Design Icons')

package() {
    cp -dr "$srcdir/evolus-pencil/usr" "$pkgdir"
    # fix permissions of directories
    chmod -R a+rX "$pkgdir"/*
}
