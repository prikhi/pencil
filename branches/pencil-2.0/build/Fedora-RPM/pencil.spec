Name:           pencil
Version:        @VERSION@.@BUILD@
Release:        1%{?dist}
Summary:        A sketching and GUI prototyping tool

Group:          Development/Tools
License:        GPLv2
URL:            http://code.google.com/p/evoluspencil/
Source0:        http://evoluspencil.googlecode.com/files/%{name}-%{version}.tar.gz

Requires:       xulrunner >= @MIN_VERSION@
BuildArch:      noarch

%description
Pencil is an open source GUI prototyping and sketching tools released under GPL.


%prep
%setup -q


%build


%install
mkdir -p $RPM_BUILD_ROOT
cp -R usr $RPM_BUILD_ROOT/


%clean
rm -rf $RPM_BUILD_ROOT


%files
%doc COPYING
%{_datadir}/applications/%{name}.desktop
%{_datadir}/%{name}/
%{_bindir}/%{name}


%changelog
* Thu Jun 14 2012 Truong Anh Tuan <tuanta@iwayvietnam.com> - 2.0-1
- Initial release 2.0 from upstream.

