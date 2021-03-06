import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import { getAllUsers } from '../../actions/users';
import { toFormatedString } from './../../utils/dateConversion';
import { isAdmin, isStaffUser } from './../../utils/service';
import NavPagination from './../../components/partials/paginator/NavPagination';

class UsersTable extends Component {
    constructor(props) {
        super(props);
        this.showRowsOfUsers = this.showRowsOfUsers.bind(this);
        this.handleClickNavigation = this.handleClickNavigation.bind(this);
    }

    viewIcon(role) {
        if (isAdmin(role)) {
            return <span><i className="far fa-star ml-1"></i></span>;
        } else if (isStaffUser(role)) {
            return <span><i className="fas fa-user-cog ml-1"></i></span>;
        }
        return false;
    }

    static mapStateToProps(store) {
        return { users: store.users };
    }

    static mapDispatchToProps(dispatch) {
        return { 
            getAllUsers: (page, limit) => dispatch(getAllUsers(page, limit))
        };
    }

    componentDidMount() {
        if (!this.props.users.isFetching) {
            let page;
            if (this.props.users.usersObject && this.props.users.usersObject.page) {
                page = this.props.users.usersObject.page;
            }
            this.props.getAllUsers(page);
        }
    }

    userRow(users) {
        return users.map(user => {
            return (
                <tr key={user.login}>
                    <td><Link className="link-style text-nowrap" to={`/users/${user.login}`}>{user.login}{this.viewIcon(user.role)}</Link></td>
                    <td><Link className="link-style text-nowrap" to={`/users/${user.login}`}>{user.fullname}</Link></td>
                    <td className="text-center">{user.registries.length}</td>
                    <td className="text-center">{user.upcomingInvoices.length}</td>
                    <td className="text-nowrap">{toFormatedString(user.registered)}</td>
                </tr>
            );
        });
    }

    singleRowInfo(info) {
        return (
            <tr>
                <td colSpan="5">
                    <span className="informal">{info}</span>
                </td>
            </tr>
        );
    }

    showRowsOfUsers() {
        if (this.props.users.usersObject === null && !this.props.users.error) {
            return this.singleRowInfo("???????????????????????? ??????????");
        } else if (this.props.users.error) {
            return this.singleRowInfo("?????????????? ?????????????? ?????? ?????? ????????????????????????");
        } else if (Array.isArray(this.props.users.usersObject.data) && this.props.users.usersObject.data.length === 0) {
            return this.singleRowInfo("?? ?????????????? ?????????? ?????????????? ??????????????????????");
        } else if (Array.isArray(this.props.users.usersObject.data) && this.props.users.usersObject.data.length > 0) {
            return this.userRow(this.props.users.usersObject.data);
        } else {
            return this.singleRowInfo("???????????????????????? ??????????");
        }
    }

    handleClickNavigation(e) {
        if (!this.props.users.isFetching) {
            const page = e.currentTarget.getAttribute("data-page");
            if (!page) return;
            this.props.getAllUsers(page);
        }
    }

    textInfo(users) {
        if (users && Array.isArray(users.data)) {
            if (users.data.length > 0) {
                return (
                    <p>
                        ???? ?????????????????????? ???? <b>{users.page}</b> ???????????????? ?? 
                        <b> {users.totalPages}</b> ????????????.<br/>
                        ?????????? ?? <i>??????????????</i> ???????????????? <b>{users.data.length}</b> ????????????????????(-??)(-????) ?? 
                        <b> {users.totalCount}</b> ????????????????????(-????) ???? ?????????? ????????????.
                    </p>
                );
            } else {
                return <p>???? ????????, ???? ?????????? ???????????? ?????????? ????????????????????????.</p>;
            }
        } else {
            return <p>????????????????????????...</p>;
        }
    }

    render() {
        return (
            <React.Fragment>
                {this.textInfo(this.props.users ? this.props.users.usersObject : null)}
                <div className="table-responsive p-3">
                    <table className="mx-auto mb-4 styled mr-3" id="users">
                        <thead>
                            <tr>
                                <th rowSpan="2">Login</th>
                                <th rowSpan="2">?????????? ????&#39;??</th>
                                <th colSpan="2" className="reset-th head">??????????????????</th>
                                <th rowSpan="2">???????? ????????????????????</th>
                            </tr>
                            <tr>
                                <th className="reset-th small">????????????????</th>
                                <th className="reset-th small">??????????????<br/>??????????????????</th>
                            </tr>
                        </thead>
                        <tbody>
                            <this.showRowsOfUsers />
                        </tbody>
                    </table>
                </div>
                {this.props.users.usersObject &&
                    <NavPagination page={this.props.users.usersObject.page} totalPages={this.props.users.usersObject.totalPages} isFetching={this.props.users.isFetching} callbackPageClicked={this.handleClickNavigation} />
                }
                </React.Fragment>
        );
    }
}

UsersTable.propTypes = {
    users: PropTypes.object.isRequired,
    getAllUsers: PropTypes.func.isRequired  
};

export default withRouter(connect(UsersTable.mapStateToProps, UsersTable.mapDispatchToProps)(UsersTable));